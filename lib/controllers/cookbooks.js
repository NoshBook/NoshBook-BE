const { Router } = require('express');
const authenticate = require('../middleware/authenticate');
const CookBook = require('../models/Cookbook');

// feel free to change this pathname
module.exports = Router()
  .post('/add', authenticate, async (req, res, next) => {
    try {
      const { recipeId, userId } = req.body;
      const response = await CookBook.addRecipe({ recipeId, userId });
      res.json(response);
    } catch (error) {
      next(error);
    }
  })

  .get('/:id', authenticate, async (req, res, next) => {
    try {
      const { id } = req.params;
      const cookbookRecipesByUser = await CookBook.getAllByUserId(id);
      res.json(cookbookRecipesByUser);
    } catch (error) {
      next(error);
    }
  });
