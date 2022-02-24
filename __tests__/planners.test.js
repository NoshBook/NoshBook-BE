const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');
const Planner = require('../lib/models/Planner');

const testPlanner = {
  day: 'tuesday',
  recipeId: 3,
  userId: 1,
};

describe('planner routes', () => {
  beforeEach(() => {
    return setup(pool);
  });

  afterAll(() => {
    pool.end();
  });

  it('should create a new planner day recipe association', async () => {
    const res = await request(app).post('/api/v1/planners').send(testPlanner);

    expect(res.body).toEqual({
      day: 'tuesday',
      recipeId: '3',
      userId: '1',
      id: expect.any(String),
    });
  });

  it('should get all recipes in planner for a given user', async () => {
    const res = await request(app).get('/api/v1/planners/1');

    expect(res.body).toEqual([
      {
        day: 'monday',
        recipes: [
          {
            id: 1,
            name: 'banana bread',
          },
          {
            id: 2,
            name: 'corndog',
          },
        ],
      },
    ]);
  });
});
