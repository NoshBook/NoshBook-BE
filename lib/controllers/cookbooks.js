const { Router } = require('express');
const CookBook = require('../models/Cookbook');

// feel free to change this pathname
module.exports = Router()
  .post('/add', async (req, res, next) => {
    try {
      const { recipeId, userId } = req.body;
      const response = await CookBook.addRecipe({ recipeId, userId });
      res.json(response);
    } catch (error) {
      next(error);
    }
  })

  .get('/pagination', async (req, res, next) => {
    const { page, quantity } = req.query;
    const { id } = req.user;

    if (page && quantity) {
      try {
        const cookbookRecipesByUser = await CookBook.getByUserIdPagination(
          String(id),
          Number(page),
          Number(quantity)
        );
        res.json(cookbookRecipesByUser);
      } catch (error) {
        next(error);
      }
    } else {
      const newError = createError(
        'Invalid Request: valid page and quantity queries required.',
        400
      );
      next(newError);
    }
  })

  .get('/:id', async (req, res, next) => {
    try {
      const { id } = req.params;
      const cookbookRecipesByUser = await CookBook.getAllByUserId(id);
      res.json(cookbookRecipesByUser);
    } catch (error) {
      next(error);
    }
  })

  .delete('/delete/:recipeId', async (req, res, next) => {
    try {
      const { recipeId } = req.params;
      const { id } = req.user;
      const deleted = await CookBook.deleteByRecipeId({ recipeId, id });

      res.json(deleted);
    } catch (e) {
      next(e);
    }
  });
