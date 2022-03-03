const request = require('superagent');
const Recipe = require('../models/Recipe.js');

async function indexRecipe(recipe) {
  const res = await request
    .post(`${process.env.BONSAI_URL}/noshbook/recipes/${recipe.id}`)
    .send(recipe);
  if(res.status >= 400) {
    console.log(res.body);
    throw new Error('An error occured while sending a recipe to elasticsearch.')
  }
}

async function test() {
  let recipe = await Recipe.getById(165);
  await indexRecipe(recipe);
  recipe = await Recipe.getById(164);
  await indexRecipe(recipe);
  recipe = await Recipe.getById(163);
  await indexRecipe(recipe);
  recipe = await Recipe.getById(162);
  await indexRecipe(recipe);
  recipe = await Recipe.getById(161);
  await indexRecipe(recipe);
}

async function deleteElasticIndices() {
  try {
    const res = await request
      .delete(`${process.env.BONSAI_URL}/noshbook`)
  } catch (e) {
    console.log(res);
    throw e;
  }
}

async function loadElastic() {
  try {
    const recipes = await Recipe.getAll()
    console.log('got all recipes, count: ' + recipes.length);
    for(let i = 0; i < recipes.length; i++) {
      // Bonsai only allows two concurrent connections so
      // we get to do this
      await indexRecipe(recipes[i]);
    }
  } catch (e) {
    console.log(e);
    throw e;
  }
}

async function search(query, start, count) {
  const res = await request
    .get(`${process.env.BONSAI_URL}/noshbook/_search`)
    .send({
      from: start,
      size: count,
      query: {
        multi_match: {
          fields: [ 'name', 'ingredients', 'tags' ],
          query,
          fuzziness: 'AUTO'
        }
      }
    });
  if(res.status >= 400) {
    throw new Error('Unable to perform search.')
  }
  const ids = res.body.hits.hits.map(hit => hit._id);
  console.log(ids);
  return ids;
}

module.exports = { deleteElasticIndices, loadElastic, search }