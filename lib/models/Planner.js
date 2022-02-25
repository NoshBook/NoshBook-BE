const pool = require('../utils/pool.js');

module.exports = class Planner {
  id;
  userId;
  day;
  recipeId;

  constructor(row) {
    this.id = row.id;
    this.day = row.day;
    this.userId = row.user_id;
    this.recipeId = row.recipe_id;
  }

  static async insert({ day, userId, recipeId }) {
    const { rows } = await pool.query(
      `INSERT INTO day_planner 
      (day, user_id, recipe_id)
      VALUES ($1, $2, $3)
      RETURNING *;`,
      [day, userId, recipeId]
    );

    return new Planner(rows[0]);
  }

  static async getRecipesByUser(id) {
    const { rows } = await pool.query(
      `SELECT day,
      JSON_AGG(JSON_BUILD_OBJECT('id', recipe.id, 'name', recipe.name)) AS RECIPES
      FROM day_planner 
      RIGHT JOIN recipe on day_planner.recipe_id = recipe.id 
      WHERE user_id=$1 
      GROUP BY day`,
      [id]
    );

    return rows;
  }
};
