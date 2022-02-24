const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');

describe('backend routes', () => {
  beforeEach(() => {
    return setup(pool);
  });

  afterAll(() => {
    pool.end();
  });

  it('should return an array of recipes', async () => {
    const recipe = {
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

    const { body } = await request(app).get(
      `/api/v1/recipes?page=${1}&quantity=${20}`
    );

    expect(body[0].rating > body[1].rating > body[2].rating).toBe(true);
    expect(body).toEqual(expect.arrayContaining([recipe]));
  });
});
