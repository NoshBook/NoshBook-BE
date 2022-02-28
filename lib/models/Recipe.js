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
  ownerId;

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
    this.ownerId = row.owner_id;
  }

  static async getAllPaginated(page, quantity) {
    const currentOffest = page * quantity - 20;
    const { rows } = await pool.query(
      `
      SELECT
        recipe.*,
        json_agg(ingredient.description) AS ingredients
      FROM 
        recipe
      LEFT JOIN 
        ingredient
      ON 
        ingredient.recipe_id = recipe.id
      GROUP BY 
        recipe.id
      ORDER BY 
        recipe.rating desc
      LIMIT $1
      OFFSET $2;
    `,
      [quantity, currentOffest]
    );

    return rows.map((row) => new Recipe(row));
  }

  static async getSafePaginated(page, quantity) {
    const currentOffest = page * quantity - 20;
    const { rows } = await pool.query(
      `
      SELECT
        recipe.*,
        json_agg(ingredient.description) AS ingredients
      FROM 
        recipe
      LEFT JOIN 
        ingredient
      ON 
        ingredient.recipe_id = recipe.id
      WHERE 
        recipe.owner_id IS NULL
      GROUP BY 
        recipe.id
      ORDER BY 
        recipe.rating desc
      LIMIT $1
      OFFSET $2;
    `,
      [quantity, currentOffest]
    );

    return rows.map((row) => new Recipe(row));
  }

  static async getById(id) {
    const { rows } = await pool.query(
      `
      SELECT
        recipe.*,
        json_agg(ingredient.description) AS ingredients
      FROM recipe
      LEFT JOIN ingredient
      ON ingredient.recipe_id = recipe.id
      WHERE recipe.id = $1
      GROUP BY recipe.id
      `,
      [id]
    );

    if (!rows[0]) return null;

    return new Recipe(rows[0]);
  }
};
