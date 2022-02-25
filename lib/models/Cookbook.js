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
    // 🟡 validate the current row doesn't exist
    const { rows } = await pool.query(
      `INSERT INTO cookbook 
      (recipe_id, user_id)
      VALUES ($1, $2)
      RETURNING *;`,
      [recipeId, userId]
    );
    return new CookBook(rows[0]);
  }
};
