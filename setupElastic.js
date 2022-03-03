const request = require('superagent');
const { deleteElasticIndices, loadElastic } = require('./lib/utils/bonsaiElastic.js');

async function setupElastic() {
  await deleteElasticIndices();
  await loadElastic();
}

setupElastic();