const pool = require('../utils/pool.js');

module.exports = class ShoppingList {
  ingredients;

  constructor(ingredients) {
    this.ingredients = ingredients;
  }

  static async generateForUserId(userId) {
    const { rows } = await pool.query(`
      SELECT (
        ingredient.id
      ) FROM day_planner
      LEFT JOIN recipe
      ON recipe.id = day_planner.recipe_id
      LEFT JOIN ingredient
      ON recipe.id = ingredient.recipe_id
      WHERE day_planner.user_id = $1
    `, [userId]);

    await Promise.all(rows.map(row => {
      return pool.query(`
        INSERT INTO shopping_list (user_id, ingredient_id) VALUES ($1, $2)
      `, [userId, row.id]);
    }));

    return await this.getByUserId(userId);
  }

  static async getByUserId(userId) {
    const { rows } = await pool.query(`

    `, [userId]);

  }
};
