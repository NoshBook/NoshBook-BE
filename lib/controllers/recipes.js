const { Router } = require('express');
const authenticate = require('../middleware/authenticate.js');
const Recipe = require('../models/Recipe.js');
const RatingsService = require('../services/RatingsService.js');
const createError = require('../utils/createError.js');

module.exports = Router().get('/', async (req, res, next) => {
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
      await RatingsService.updateRating(id, rating);
      res.json({ message: 'success' });
    } catch (error) {
      next(error);
    }
  });
