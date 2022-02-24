const fs = require('fs');

/* 
module.exports = (pool) => {
  return fs
    .readFile(`${__dirname}/../sql/setup.sql`, { encoding: 'utf-8' })
    .then((sql) => pool.query(sql))
    .then(() => console.log('✅ Database setup complete!'))
    .catch((error) => {
      const dbNotFound = error.message.match(/database "(.+)" does not exist/i);

      if (dbNotFound) {
        const [err, db] = dbNotFound;
        console.error('❌ Error: ' + err);
        console.info(
          `Try running \`createdb -U postgres ${db}\` in your terminal`
        );
      } else {
        console.error(error);
        console.error('❌ Error: ' + error.message);
      }
    });
};
*/

module.exports = async (pool) => {
  const production = process.env.NODE_ENV === 'production';
  const resetOkay = process.env.DB_RESET_OK === 'true';
  if (production && !resetOkay) {
    throw new Error('Attempting to reset deployed db!! Use `heroku run DB_RESET_OK=true npm run setup-db` if this was intentional.');
  }

  const setupFile = fs.readFileSync(`${__dirname}/../sql/setup.sql`);
  await pool.query(setupFile.toString());
  console.log('Table setup complete');
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
        recipe.time.total,
        recipe.servings,
        recipe.image,
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
      console.log(e);
      console.log(recipe);
    }
  }));
  console.log('Recipe data loaded.');
};
