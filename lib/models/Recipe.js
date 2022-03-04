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
  sourceUrl;
  isPublic;

  constructor(row) {
    this.id = row.id;
    this.name = row.name;
    this.description = row.description;
    this.ingredients = row.ingredients;
    // The agg seems to return [null] if there's no ingredients, which makes React unhappy
    if (this.ingredients.length === 1 && this.ingredients[0] === null) {
      this.ingredients = [];
    }
    this.instructions = row.instructions;
    this.tags = row.tags;
    this.servings = row.servings;
    this.image = row.image;
    this.totalTime = row.total_time;
    this.rating = row.rating;
    this.ratingsCount = row.ratings_count;
    this.ownerId = row.owner_id;
    this.sourceUrl = row.source_url;
    this.isPublic = row.is_public;
  }

  static async getAllPaginated(page, quantity) {
    const currentOffset = page * quantity - 20;
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
        recipe.is_public = true
      AND 
        recipe.owner_id IS NOT NULL
      GROUP BY 
        recipe.id
      ORDER BY 
        recipe.rating desc, recipe.id asc
      LIMIT $1
      OFFSET $2;
    `,
      [quantity, currentOffset]
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
        recipe.rating desc, recipe.id asc
      LIMIT $1
      OFFSET $2;
    `,
      [quantity, currentOffest]
    );
    return rows.map((row) => new Recipe(row));
  }

  static async getAllNonUser() {
    const { rows } = await pool.query(`
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
    `);

    return rows.map((row) => new Recipe(row));
  }

  static async getById(id, client) {
    // Allows for this function to be used in a transaction if needed.
    let db = client;
    // Just use pool like normal if client wasn't supplied
    if (!db) db = pool;

    const { rows } = await db.query(
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
        recipe.id = $1
      GROUP BY
        recipe.id
      `,
      [id]
    );

    if (!rows[0]) return null;

    return new Recipe(rows[0]);
  }

  static async updateRatingById(id, rating, ratingsCount) {
    await pool.query(
      `
      UPDATE recipe
      SET rating=$1, ratings_count=$2
      WHERE id=$3
    `,
      [rating, ratingsCount, id]
    );
  }

  static async updateIsPublicById(approval, id) {
    await pool.query(
      `
      UPDATE recipe
      SET is_public=$1
      WHERE id=$2
    `,
      [approval, id]
    );
  }

  static async updateOneById(
    id,
    {
      name,
      description,
      ingredients,
      instructions,
      tags,
      servings,
      image,
      totalTime,
    },
    client
  ) {
    // Allows for this function to be used in a transaction if needed.
    let db = client;
    // Just use pool like normal if client wasn't supplied
    if (!db) db = pool;

    await db.query(
      `
    UPDATE recipe
    SET name=$1, description=$2, instructions=$3, tags=$4,
    servings=$5, image=$6, total_time=$7
    WHERE id=$8
  `,
      [name, description, instructions, tags, servings, image, totalTime, id]
    );

    // Find the existing ingredients
    const { rows } = await db.query(
      `
      SELECT id FROM ingredient WHERE recipe_id=$1
    `,
      [id]
    );

    // Delete them
    await Promise.all(
      rows.map(
        async (row) =>
          await db.query(
            `
      DELETE FROM ingredient WHERE id=$1
    `,
            [row.id]
          )
      )
    );

    // Insert the new ingredients
    await Promise.all(
      ingredients.map(
        async (ingredient) =>
          await db.query(
            `
      INSERT INTO ingredient (description, recipe_id)
      VALUES ($1, $2)
    `,
            [ingredient, id]
          )
      )
    );
  }

  static async insertOne(
    userId,
    {
      name,
      description,
      ingredients,
      instructions,
      tags,
      servings,
      image,
      totalTime,
      sourceUrl,
      rating,
      ratingsCount,
      isPublic,
    },
    client
  ) {
    // Allows for this function to be used in a transaction if needed.
    let db = client;
    // Just use pool like normal if client wasn't supplied
    if (!db) db = pool;

    const { rows } = await db.query(
      `
    INSERT INTO recipe (name, description, instructions, tags,
    servings, image, total_time, owner_id, source_url, rating, ratings_count, is_public)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
    RETURNING *;
  `,
      [
        name,
        description,
        instructions,
        tags,
        servings,
        image,
        totalTime,
        userId,
        sourceUrl ?? null,
        rating ?? 0,
        ratingsCount ?? 0,
        isPublic ?? false,
      ]
    );

    const newId = rows[0].id;
    await Promise.all(
      ingredients.map(
        async (ingredient) =>
          await db.query(
            `
      INSERT INTO ingredient (description, recipe_id)
      VALUES ($1, $2)
    `,
            [ingredient, newId]
          )
      )
    );

    return newId;
  }
};
