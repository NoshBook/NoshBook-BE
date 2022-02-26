const { Router } = require('express');
const CookBook = require('../models/Cookbook');

// feel free to change this pathname
module.exports = Router().get('/add/:id', async (req, res, next) => {
  try {
    const recipeId = req.params.id;
    const userId = req.user.id;
    const response = await CookBook.addRecipe({ recipeId, userId });
    res.json(response);
  } catch (error) {
    next(error);
  }
});
