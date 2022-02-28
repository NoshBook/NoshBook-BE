const { Router } = require('express');
const authenticate = require('../middleware/authenticate');
const Planner = require('../models/Planner');

const router = Router();

router.post('/', async (req, res, next) => {
  try {
    const plannerRecipe = await Planner.insert({
      ...req.body,
      userId: req.user.id,
    });
    res.json(plannerRecipe);
  } catch (e) {
    next(e);
  }
});

router.get('/', async (req, res, next) => {
  try {
    const { id } = req.user;
    const plannerRecipes = await Planner.getRecipesByUser(id);

    res.json(plannerRecipes);
  } catch (e) {
    next(e);
  }
});

router.delete('/delete/:id', async (req, res, next) => {
  try {
    const userId = req.user.id;
    const recipeId = req.params.id;

    const deletedRecipe = await Planner.deleteRecipeById({
      userId,
      recipeId,
    });

    res.json(deletedRecipe);
  } catch (e) {
    next(e);
  }
});

router.delete('/delete', async (req, res, next) => {
  try {
    const { id } = req.user;
    const deletedRecipes = await Planner.deleteAllRecipesFromPlanner(id);

    res.json(deletedRecipes);
  } catch (e) {
    next(e);
  }
});

module.exports = router;
