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
  const setupFile = fs.readFileSync(`${__dirname}/../sql/setup.sql`);
  await pool.query(setupFile.toString());
  console.log('Table setup complete');
  const recipeFile = fs.readFileSync(`${__dirname}/./recipes.json`);
  const recipes = JSON.parse(recipeFile.toString());
  await Promise.all(recipes.map(async (recipe) => {
    await pool.query(`
      INSERT INTO recipe (
        name,
        description,
        ingredients,
        instructions,
        tags,
        servings,
        image,
        total_time)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    `, [
      recipe.name,
      recipe.description,
      recipe.ingredients,
      recipe.instructions,
      recipe.tags,
      recipe.time.total,
      recipe.servings,
      recipe.image
    ]);
  }));
  console.log('Recipe data loaded.');
};
