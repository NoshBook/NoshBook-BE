const { Router } = require('express');
const authenticate = require('../middleware/authenticate');
const Planner = require('../models/Planner');

const router = Router();

router.post('/', authenticate, async (req, res, next) => {
  try {
    const planner_recipe = await Planner.insert({
      ...req.body,
      userId: req.user.id,
    });
    res.json(planner_recipe);
  } catch (e) {
    next(e);
  }
});

router.get('/', authenticate, async (req, res, next) => {
  try {
    const { id } = req.user;
    const planner_recipes = await Planner.getRecipesByUser(id);

    res.json(planner_recipes);
  } catch (e) {
    next(e);
  }
});

router.delete('/clear', authenticate, async (req, res, next) => {
  try {
    const { id } = req.user;
    const cleared_recipes = await Planner.clearRecipesFromPlanner(id);

    res.json(cleared_recipes);
  } catch (e) {
    next(e);
  }
});

module.exports = router;
