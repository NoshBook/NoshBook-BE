const { Router } = require('express');
const CookBook = require('../models/Cookbook');

// feel free to change this pathname
module.exports = Router().post('/add', async (req, res, next) => {
  try {
    const { recipeId, userId } = req.body;
    const response = await CookBook.addRecipe({ recipeId, userId });
    res.json(response);
  } catch (error) {
    next(error);
  }
});
