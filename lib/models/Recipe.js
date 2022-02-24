const pool = require('../utils/pool.js');

module.exports = class Recipe {
  id;
  name;
  description;
  ingredients;
  instructions;
  tags;
  servings;
  image;
  totalTime;

  constructor(row) {
    this.id = row.id;
    this.name = row.name;
    this.description = row.description;
    this.ingredients = row.ingredients;
    this.instructions = row.instructions;
    this.tags = row.tags;
    this.servings = row.servings;
    this.image = row.image;
    this.totalTime = row.total_time;
  }

  static async getAll() {
    const { rows } = await pool.query(`
      SELECT
        recipe.*,
        json_agg(ingredient.description) AS ingredients
      FROM recipe
      LEFT JOIN ingredient
      ON ingredient.recipe_id = recipe.id
      GROUP BY recipe.id;
    `);

    return rows.map(row => new Recipe(row));
  }
};
