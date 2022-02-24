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

  static async getRecipesByDay({ day, userId }) {
    console.log(typeof day);

    const { rows } = await pool.query(
      `SELECT recipe.* 
      FROM day_planner 
      RIGHT JOIN recipe on day_planner.recipe_id=recipe.id 
      WHERE day=$1 AND user_id=$2`,
      [day, userId]
    );

    return rows.map((recipe) => recipe);
  }
};
