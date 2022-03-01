const createError = require('../utils/createError.js');
const pool = require('../utils/pool.js');

module.exports = class CookBook {
  id;
  userId;
  recipeId;

  constructor(row) {
    this.id = row.id;
    this.userId = row.user_id;
    this.recipeId = row.recipe_id;
  }

  static async addRecipe({ recipeId, userId }) {
    const findMatchingRecipePerUser = await pool.query(
      'SELECT * FROM cookbook WHERE recipe_id = $1 AND user_id = $2',
      [recipeId, userId]
    );

    const isDuplicate = findMatchingRecipePerUser.rows[0];
    if (isDuplicate) {
      return createError('Recipe already exists in user cookbook.', 400, true);
    }

    const { rows } = await pool.query(
      `INSERT INTO cookbook 
      (recipe_id, user_id)
      VALUES ($1, $2)
      RETURNING *;`,
      [recipeId, userId]
    );
    return new CookBook(rows[0]);
  }

  static async getAllByUserId(id) {
    const { rows } = await pool.query(
      `SELECT 
      * 
      FROM 
      cookbook 
      LEFT JOIN
      recipe
      ON
      recipe.id = cookbook.recipe_id
      WHERE 
      user_id = $1`,
      [id]
    );

    if (!rows[0]) return null;

    const cookbookRecipes = rows.map((row) => new CookBook(row));

    return cookbookRecipes;
  }

  static async deleteByRecipeId({ id, recipeId }) {
    const { rows } = await pool.query(
      'DELETE FROM cookbook WHERE user_id=$1 AND recipe_id=$2 RETURNING *',
      [id, recipeId]
    );

    if (!rows[0]) return null;
    return new CookBook(rows[0]);
  }
};
