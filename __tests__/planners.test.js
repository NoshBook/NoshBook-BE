const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');
const Planner = require('../lib/models/Planner.js');

const agent = request.agent(app);

const testPlanner = {
  day: 'tuesday',
  recipeId: 3,
  userId: 1,
};

const mockUser = {
  username: 'bob',
  password: 'bob',
};

describe('planner routes', () => {
  beforeEach(async () => {
    await agent.post('/api/v1/users/sessions').send(mockUser);
    return setup(pool);
  });

  afterAll(() => {
    pool.end();
  });

  it('should create a new planner day recipe association', async () => {
    const res = await agent.post('/api/v1/planners').send(testPlanner);

    expect(res.body).toEqual({
      day: 'tuesday',
      recipeId: '3',
      userId: '1',
      id: expect.any(String),
    });
  });

  it('should get all recipes in planner for a given user', async () => {
    const res = await agent.get('/api/v1/planners');

    const recipes = await Planner.getRecipesByUser(1);

    expect(res.body).toEqual(recipes);
  });
});
