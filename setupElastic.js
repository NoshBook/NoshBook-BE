const { deleteElasticIndices, loadElastic } = require('./lib/utils/bonsai.js');

async function setupElastic() {
  await deleteElasticIndices();
  await loadElastic();
}

setupElastic();