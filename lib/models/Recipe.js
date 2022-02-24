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
    this.rating = row.rating;
  }

  static async getPaginated(page, quantity) {
    const currentOffest = page * quantity - 20;
    const { rows } = await pool.query(
      `
      SELECT
        recipe.*,
        json_agg(ingredient.description) AS ingredients
      FROM recipe
      LEFT JOIN ingredient
      ON ingredient.recipe_id = recipe.id
      GROUP BY recipe.id
      ORDER BY recipe.rating desc
      LIMIT 20
      OFFSET $1;
    `,
      [currentOffest]
    );

    return rows.map((row) => new Recipe(row));
  }
};
