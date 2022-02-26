const { Router } = require('express');
const Recipe = require('../models/Recipe.js');
const createError = require('../utils/createError.js');

module.exports = Router().get('/', async (req, res, next) => {
  const { page, quantity } = req.query;

  if (page && quantity) {
    try {
      const recipes = await Recipe.getPaginated(page, quantity);
      res.json(recipes);
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
});
