const Recipe = require('../models/Recipe.js');
const { addNewRating } = require('../utils/incrementalAverage.js');

module.exports = class RatingsService {
  static async updateRating(recipeId, newRating) {
    const { rating, ratingsCount } = await Recipe.getById(recipeId);
    const { updatedRating, newCount } = addNewRating(rating, ratingsCount, newRating);
    await Recipe.updateRatingById(recipeId, updatedRating, newCount);
  }
};
