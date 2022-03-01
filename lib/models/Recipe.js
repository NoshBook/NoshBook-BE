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
  rating;
  ratingsCount;

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
    this.ratingsCount = row.ratings_count;
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

  static async updateRatingById(id, rating, ratingsCount) {
    await pool.query(`
      UPDATE recipe
      SET rating=$1, ratings_count=$2
      WHERE id=$3
    `, [rating, ratingsCount, id]);
  }

  static async updateOneById(id, {
    name,
    description,
    ingredients,
    instructions,
    tags,
    servings,
    image,
    totalTime,
    ownerId,
    rating,
    ratingsCount
  }, client) {
    // Allows for this function to be used in a transaction if needed.
    let db = client;
    // Just use pool like normal if client wasn't supplied
    if(!db) db = pool;

    await db.query(`
    UPDATE recipe
    SET name=$1, description=$2, instructions=$3, tags=$4,
    servings=$5, image=$6, total_time=$7, owner_id=$8, rating=$9, ratings_count=$10
    WHERE id=$11
  `, [name, description, instructions, tags, servings,
      image, totalTime, ownerId, rating, ratingsCount, id]);

    await Promise.all(ingredients.map(async (ingredient) => await db.query(`
      INSERT INTO ingredient (description, recipe_id)
      VALUES ($1, $2)
    `, [ingredient, id])));

  }

  static async insertOne(userId, {
    name,
    description,
    ingredients,
    instructions,
    tags,
    servings,
    image,
    totalTime
  }, client) {

    const { rows } = await pool.query(`
    INSERT INTO recipe (name, description, instructions, tags,
    servings, image, total_time, owner_id)
    VALUES ($1, $2, $3, $4, $5, $5, $6, $7, $8, $9, $10)
  `, [name, description, instructions, tags, servings,
      image, totalTime, userId]);

    const { id } = rows[0];

    await Promise.all(ingredients.map(async (ingredient) => await client.query(`
      INSERT INTO ingredient (description, recipe_id)
      VALUES ($1, $2)
    `, [ingredient, id])));

    
    return new Recipe(rows[0]);
    
  }
};
