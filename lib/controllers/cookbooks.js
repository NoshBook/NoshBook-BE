const { Router } = require('express');
const CookBook = require('../models/Cookbook');

// feel free to change this pathname
module.exports = Router().post('/add:id', (req, res, next) => {
  try {
    const recipeId = req.params.id;
    const userId = req.user.id;
    const response = await CookBook.addRecipe(recipeId, userId);
    res.json(response);
  } catch (error) {
    next(err);
  }
});
