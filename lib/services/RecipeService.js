const CookBook = require('../models/Cookbook.js');
const Recipe = require('../models/Recipe.js');
const { search } = require('../utils/bonsaiElastic.js');
const { calcNewRating } = require('../utils/incrementalAverage.js');
const pool = require('../utils/pool.js');

module.exports = class RatingsService {
  static async updateRating(recipeId, newRating) {
    const { rating, ratingsCount } = await Recipe.getById(recipeId);
    const { updatedRating, newCount } = calcNewRating(rating, ratingsCount, newRating);
    await Recipe.updateRatingById(recipeId, updatedRating, newCount);
  }

  static async applyEdit(userId, recipeId, recipeData) {
    // We intend for the edit button to only be shown 
    // on recipes in the cookbook, so find the cookbook 
    // entry or throw an error if not found.
    const cookbookEntries = await CookBook.findAllByRecipeIdAndUserId(recipeId, userId);
    if(cookbookEntries.length === 0) {
      throw new Error('Users may only edit recipes in their cookbook');
    }
    
    // Setup a transaction so all of the changes
    // get rolled back if any single query
    // fails.
    const client = await pool.connect();
    await client.query('BEGIN');

    try {
      // Users can copy someone elses recipe and make edits to it.
      // This checks if the recipe is someone elses.
      const recipe = await Recipe.getById(recipeId);
      if(recipe.ownerId !== userId) {
        // Make the duplicate
        const newId = await Recipe.insertOne(userId, recipeData, client);
        const newRecipe = await Recipe.getById(newId, client);
        recipeId = newRecipe.id;
        // Update the users cookbook to use the duplicate instead of the original
        await CookBook.replaceOneById(cookbookEntries[0].id, recipeId, userId, client);
      }

      // Apply the edit to the original or duplicated recipe
      await Recipe.updateOneById(recipeId, recipeData, client);
      
      // If we made it this far without an error, tell postgres this
      // transaction is complete.
      await client.query('COMMIT');
      return recipeId;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  static async searchRecipes(query, page, count) {
    if(page < 1) throw new Error('page must be 1 or greater');

    const ids = await search(query, (page - 1) * count, count);
    const recipes = [];
    for(let i = 0; i < ids.length; i++) {
      const recipe = await Recipe.getById(ids[i]);
      recipes.push(recipe);
    }
    return recipes;
  }
};
