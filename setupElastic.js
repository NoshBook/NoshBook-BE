//const request = require('superagent');
const { deleteElasticIndices, loadElastic, createElasticIndex } = require('./lib/utils/bonsaiElastic.js');

async function setupElastic() {
  await deleteElasticIndices();
  await createElasticIndex();
  await loadElastic();
}

/*
async function getAll() {
  const res = await request
    .get(`${process.env.BONSAI_URL}/noshbook/_search`)
    .send({
      from: 0,
      size: 200,
      query: {
        match: {
          name: {
            query: 'chile con queso',
            operator: 'AND'
          }
        }
      }
    });
  if(res.status >= 400) {
    throw new Error('Unable to perform search.');
  }
  const ids = res.body.hits.hits.map(hit => hit._id);
  console.log(JSON.stringify(res.body, null, ' '));
  console.log(JSON.stringify(ids, null, ' '));
  return ids;
}

getAll();
*/

setupElastic();
