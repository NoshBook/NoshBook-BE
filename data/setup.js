const fs = require('fs');
const bcrypt = require('bcrypt');
const dblog = require('../lib/utils/dblog.js');

async function loadTestData(pool) {
  const testDataFile = fs.readFileSync(`${__dirname}/../sql/loadTestData.sql`);

  await pool.query(testDataFile.toString());
  
  const bobPasswordHash = await bcrypt.hash(
    'bob',
    Number(process.env.SALT_ROUNDS)
  );

  await pool.query(`
    UPDATE app_user
    SET password_hash = $1
    WHERE id = 1
  `, [bobPasswordHash]);

  dblog('Table setup complete');
}

module.exports = async (pool) => {
  const production = process.env.NODE_ENV === 'production';
  const resetOkay = process.env.DB_RESET_OK === 'true';
  if (production && !resetOkay) {
    throw new Error('Attempting to reset deployed db!! Use `heroku run DB_RESET_OK=true npm run <the command you just ran>` if this was intentional.');
  }

  //Prevents bob and his dog corn from being on the live site.
  if(!production) {
    loadTestData(pool);
  }

  const recipeFile = fs.readFileSync(`${__dirname}/./recipes.json`);
  const recipes = JSON.parse(recipeFile.toString());
  await Promise.all(recipes.map(async (recipe) => {
    try {
      const { rows } = await pool.query(`
        INSERT INTO recipe (
          name,
          description,
          instructions,
          tags,
          servings,
          image,
          total_time,
          source_url)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING id
      `, [
        recipe.name,
        recipe.description,
        recipe.instructions,
        recipe.tags,
        recipe.servings,
        recipe.image,
        recipe.time.total,
        recipe.sourceURL
      ]);

      await Promise.all(recipe.ingredients.map(async (ingredient) => {
        return pool.query(`
          INSERT INTO ingredient (
            description,
            recipe_id
          ) VALUES ($1, $2)
        `, [ingredient, rows[0].id]);
      }));

    } catch (e) {
      dblog(e);
      dblog(recipe);
    }
  }));
  dblog('Recipe data loaded.');
};
