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

async function findBacon() {
  const res = await request
    .get(`${process.env.BONSAI_URL}/noshbook/_search`)
    .send({
      query: {
        multi_match: {
          fields: [ 'name' ],
          query: 'cheese bacon',
          fuzziness: 'AUTO'
        }
      }
    });
  console.log(JSON.stringify(res.body, null, ' '));
  console.log(res.body.hits.hits);
}

//test();
findBacon();
//loadElastic();