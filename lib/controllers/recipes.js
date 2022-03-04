const { Router } = require('express');
const authenticate = require('../middleware/authenticate.js');
const Recipe = require('../models/Recipe.js');
const RecipeService = require('../services/RecipeService.js');
const ReviewService = require('../services/ReviewService.js');
const createError = require('../utils/createError.js');

module.exports = Router()
  .get('/', async (req, res, next) => {
    const { page, quantity, withUserContent } = req.query;

    if (page && quantity) {
      try {
        if (!withUserContent) {
          const recipes = await Recipe.getSafePaginated(page, quantity);
          res.json(recipes);
        } else {
          const recipes = await Recipe.getAllPaginated(page, quantity);
          res.json(recipes);
        }
      } catch (e) {
        next(e);
      }
    } else {
      const newError = createError(
        'Invalid Request: valid page and quantity queries required.',
        400
      );
      next(newError);
    }
  })

  .get('/search', async (req, res, next) => {
    try {
      const query = req.query.q;
      if (!query) throw new Error('Please specify a query');

      const page = req.query.page ?? 1;
      let count = req.query.count ?? 20;
      if (count > 40) count = 40;
      const recipes = await RecipeService.searchRecipes(query, page, count);
      res.json(recipes);
    } catch (error) {
      next(error);
    }
  })

  .get('/:id', async (req, res, next) => {
    try {
      const { id } = req.params;
      const recipe = await Recipe.getById(id);
      res.json(recipe);
    } catch (error) {
      next(error);
    }
  })

  .post('/:id/ratings', authenticate, async (req, res, next) => {
    try {
      const { id } = req.params;
      const { rating } = req.body;
      await RecipeService.updateRating(id, rating);
      res.json({ message: 'success' });
    } catch (error) {
      next(error);
    }
  })

  .put('/:recipeId', authenticate, async (req, res, next) => {
    try {
      const { recipeId } = req.params;
      const { recipe } = req.body;
      const userId = req.user.id;
      const newRecipeId = await RecipeService.applyEdit(
        userId,
        recipeId,
        recipe
      );

      if (recipe.review) {
        await ReviewService.makeSubmitMessage({
          recipeId: newRecipeId,
          userId,
        });
      }

      res.json({
        message: 'success',
        recipeId: newRecipeId,
      });
    } catch (error) {
      next(error);
    }
  })

  .post('/', authenticate, async (req, res, next) => {
    try {
      const { recipe } = req.body;
      const userId = req.user.id;
      const newId = await RecipeService.addNew(userId, recipe);

      if (recipe.review) {
        await ReviewService.makeSubmitMessage({
          recipeId: newId,
          userId,
        });
      }
      res.json(newId);
    } catch (error) {
      next(error);
    }
  })

  .get('/approve/:id', authenticate, async (req, res, next) => {
    try {
      const { id } = req.params;
      const approval = true;

      //update db
      await Recipe.updateIsPublicById(approval, id);

      //send confirmation to council
      await ReviewService.makeApproveConfMessage(id);

      res.json({
        message: 'success',
      });
    } catch (error) {
      next(error);
    }
  });

// .post('/submit/:id', authenticate, async (req, res, next) => {
//   try {
//     const { id } = req.params;
//     const userId = req.user.id;
//     //get recipebyid
//     //trigger email to team, pass recipe content for review in email
//     await ReviewService.makeSubmitMessage({ recipeId: id, userId });
//     //include approval link w recipe id where endpoint updates ispublic to true

//     res.json(`${id} to approve, from user ${userId}`);
//   } catch (error) {
//     next(error);
//   }
// });
