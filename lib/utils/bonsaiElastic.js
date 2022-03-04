const request = require('superagent');
const Recipe = require('../models/Recipe.js');

async function indexRecipe(recipe) {
  const res = await request
    .post(`${process.env.BONSAI_URL}/noshbook/recipes/${recipe.id}`)
    .send(recipe);
  if(res.status >= 400) {
    console.log(res.body);
    throw new Error('An error occured while sending a recipe to elasticsearch.');
  }
}

async function createElasticIndex() {
  const res = await request
    .put(`${process.env.BONSAI_URL}/noshbook`);
  if(res.status >= 400) {
    console.log(res.body);
    throw new Error('An error occured while creating the elasticsearch index.');
  }

}
async function deleteElasticIndex() {
  const res = await request
    .delete(`${process.env.BONSAI_URL}/noshbook`);
  if(res.status >= 400) {
    console.log(res.body);
    throw new Error('An error occured while deleting the elasticsearch index.');
  }
}

async function loadElastic() {
  try {
    const recipes = await Recipe.getAllNonUser();
    console.log('got all recipes, count: ' + recipes.length);
    for(let i = 0; i < recipes.length; i++) {
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
          fields: ['name', 'ingredients', 'tags'],
          query,
          fuzziness: 'AUTO'
        }
      }
    });
  if(res.status >= 400) {
    throw new Error('Unable to perform search.');
  }
  const ids = res.body.hits.hits.map(hit => hit._id);
  return ids;
}

module.exports = { createElasticIndex, deleteElasticIndex, loadElastic, search };
