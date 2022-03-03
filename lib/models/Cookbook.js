const createError = require('../utils/createError.js');
const pool = require('../utils/pool.js');

module.exports = class CookBook {
  id;
  userId;
  cookbookId;
  name;
  description;
  image;
  rating;
  ownerId;

  constructor(row) {
    this.id = row.recipe_id;
    this.userId = row.user_id;
    this.cookbookId = row.id;
    this.name = row.name;
    this.description = row.description;
    this.image = row.image;
    this.rating = row.rating;
    this.ownerId = row.owner_id;
  }

  static async findAllByRecipeIdAndUserId(recipeId, userId) {
    const { rows } = await pool.query(
      'SELECT * FROM cookbook WHERE recipe_id=$1 AND user_id=$2',
      [recipeId, userId]
    );

    return rows.map((row) => new CookBook(row));
  }

  static async addRecipe({ recipeId, userId }) {
    const existingEntries = await this.findAllByRecipeIdAndUserId(
      recipeId,
      userId
    );

    const isDuplicate = existingEntries.length > 0;
    if (isDuplicate) {
      return createError('Recipe already exists in user cookbook.', 400, true);
    }

    const { rows } = await pool.query(
      `INSERT INTO cookbook 
      (recipe_id, user_id)
      VALUES ($1, $2)
      RETURNING *;`,
      [recipeId, userId]
    );
    return new CookBook(rows[0]);
  }

  // With cookbook pagination added, this is only being used in the recipe detail view for validation. Could be refactored to return less data if desired.
  static async getAllByUserId(id) {
    const { rows } = await pool.query(
      `SELECT 
        cb.recipe_id,
        cb.user_id,
        cb.id,
        r.name,
        r.rating,
        r.image,
        r.description,
        r.owner_id
      FROM 
        cookbook AS cb
      LEFT JOIN
        recipe AS r
      ON
        r.id = cb.recipe_id
      WHERE 
        user_id = $1`,
      [id]
    );

    if (!rows[0]) return null;

    const cookbookRecipes = rows.map((row) => new CookBook(row));

    return cookbookRecipes;
  }

  static async getByUserIdPagination(id, page, quantity) {
    const currentOffset = page * quantity - 20;
    const { rows } = await pool.query(
      `SELECT 
        cb.recipe_id,
        cb.user_id,
        cb.id,
        r.name,
        r.rating,
        r.image,
        r.description,
        r.owner_id
      FROM 
        cookbook AS cb
      LEFT JOIN
        recipe AS r
      ON
        r.id = cb.recipe_id
      WHERE 
        user_id = $1
      ORDER BY
        cb.id
      LIMIT $2
      OFFSET $3`,
      [id, quantity, currentOffset]
    );

    if (!rows[0]) return [];

    const cookbookRecipes = rows.map((row) => new CookBook(row));

    return cookbookRecipes;
  }

  static async deleteByRecipeId({ id, recipeId }) {
    const { rows } = await pool.query(
      'DELETE FROM cookbook WHERE user_id=$1 AND recipe_id=$2 RETURNING *',
      [id, recipeId]
    );

    if (!rows[0]) return null;
    return new CookBook(rows[0]);
  }

  static async replaceOneById(id, newRecipeId, userId, client) {
    // Allows for this function to be used in a transaction if needed.
    let db = client;
    // Just use pool like normal if client wasn't supplied
    if (!db) db = pool;

    await db.query(
      `
      UPDATE cookbook
      SET recipe_id=$2
      WHERE id=$1 AND user_id=$3
    `,
      [id, newRecipeId, userId]
    );
  }
};
