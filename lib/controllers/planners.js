const { Router } = require('express');
const Planner = require('../models/Planner.js');

const router = Router();

router.post('/', async (req, res, next) => {
  try {
    const planner_recipe = await Planner.insert(req.body);
    res.json(planner_recipe);
  } catch (e) {
    next(e);
  }
});

router.get('/:day/:userId', async (req, res, next) => {
  try {
    const { day, userId } = req.params;
    const planner_recipes = await Planner.getRecipesByDay({
      day,
      userId,
    });

    res.json(planner_recipes);
  } catch (e) {
    next(e);
  }
});

module.exports = router;
