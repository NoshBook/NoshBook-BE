const pool = require('../utils/pool.js');

module.exports = class ShoppingListItem {
  id;
  ingredient;
  isChecked;

  constructor(row) {
    this.id = row.id;
    this.ingredient = row.ingredient;
    this.isChecked = row.is_checked;
  }

  static async generateForUserId(userId) {
    await pool.query(`
      DELETE FROM shopping_list WHERE user_id=$1
    `, [userId]);

    const { rows } = await pool.query(`
      SELECT
        ingredient.id
      FROM day_planner
      LEFT JOIN recipe
      ON recipe.id = day_planner.recipe_id
      LEFT JOIN ingredient
      ON recipe.id = ingredient.recipe_id
      WHERE day_planner.user_id = $1
    `, [userId]);

    for(let i = 0; i < rows.length; i++) {
      await pool.query(`
        INSERT INTO shopping_list (user_id, ingredient_id) VALUES ($1, $2)
      `, [userId, rows[i].id]);
    }

    return await this.getByUserId(userId);
  }

  static async getByUserId(userId) {
    const { rows } = await pool.query(`
      SELECT
        shopping_list.id,
        ingredient.description AS ingredient,
        shopping_list.is_checked
      FROM shopping_list
      LEFT JOIN ingredient
      ON shopping_list.ingredient_id = ingredient.id
      WHERE shopping_list.user_id = $1
    `, [userId]);

    return rows.map(row => new ShoppingListItem(row));
  }

  static async updateIsCheckedById(userId, itemId, isChecked) {
    await pool.query(`
      UPDATE shopping_list
      SET is_checked=$2
      WHERE id=$1
    `, [itemId, isChecked]);

    return await this.getByUserId(userId);
  }
};
