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

  static async insert({ recipeId, userId }) {
    const { rows } = await pool.query(
      `INSERT INTO day_planner 
      (recipe_id, user_id)
      VALUES ($1, $2)
      RETURNING *;`,
      [recipeId, userId]
    );
    return new Planner(rows[0]);
  }
};
