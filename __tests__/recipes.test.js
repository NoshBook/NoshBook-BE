const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');

const mockRecipe = {
  id: expect.any(String),
  name: expect.any(String),
  description: expect.any(String),
  ingredients: expect.any(Array),
  instructions: expect.any(Array),
  tags: expect.any(Array),
  totalTime: expect.any(String),
  servings: expect.any(String),
  image: expect.any(String),
  rating: expect.any(Number),
};

describe('recipe routes', () => {
  beforeEach(() => {
    return setup(pool);
  });

  afterAll(() => {
    pool.end();
  });

  it('should return an array of recipes ranked by rating in desc order WITHOUT user content', async () => {
    const { body } = await request(app).get(
      `/api/v1/recipes?page=${1}&quantity=${20}`
    );
    // rating is desc
    expect(body[0].rating > body[1].rating > body[2].rating).toBe(true);
    // returning array has no valid ownerId's
    expect(body).toEqual(
      expect.arrayContaining([{ ...mockRecipe, ownerId: null }])
    );
  });

  it('should return an array of recipes ranked by rating in desc order WITH user content', async () => {
    const { body } = await request(app).get(
      `/api/v1/recipes?page=${1}&quantity=${20}&withUserContent='true'`
    );

    expect(body[0].rating > body[1].rating > body[2].rating).toBe(true);
    // returning array contains at least one valid ownerId
    expect(body[0].ownerId).toEqual('1');
    // returning array contains objects
    expect(body).toEqual(expect.arrayContaining([expect.any(Object)]));
  });
});
