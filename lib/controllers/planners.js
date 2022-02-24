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

module.exports = router;
