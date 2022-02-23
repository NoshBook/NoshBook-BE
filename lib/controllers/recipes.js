const { Router } = require('express');
const Recipe = require('../models/Recipe.js');

module.exports = Router()
  .get('/', async (req, res, next) => {
    try {
      const recipes = await Recipe.getAll();
      res.json(recipes);
    } catch (e) {
      next(e);
    }
  });
