const { Router } = require('express');
const Recipe = require('../models/Recipe.js');

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
    const error = new Error();
    error.status = 400;
    error.message =
      'Invalid Request: valid page and quantity queries required.';
    next(error);
  }
});
