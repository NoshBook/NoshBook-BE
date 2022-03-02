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

const testPlannerReceive = {
  day: 'tuesday',
  recipeId: '3',
  userId: '1',
  id: expect.any(String),
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

    expect(res.body).toEqual(testPlannerReceive);
  });

  it('should get all recipes in planner for a given user', async () => {
    const res = await agent.get('/api/v1/planners');

    const recipes = await Planner.getRecipesByUser(1);

    expect(res.body).toEqual(recipes);
  });

  it('should delete all recipes from a planner', async () => {
    const seedPlannerData = [
      { id: expect.any(String), recipe_id: '1', day: 'monday', user_id: '1' },
      { id: expect.any(String), recipe_id: '2', day: 'monday', user_id: '1' },
    ];
    const { body } = await agent.delete('/api/v1/planners/delete');

    expect(body).toEqual(seedPlannerData);
  });

  it('should delete a recipe by id', async () => {
    const deletedRecipe = [
      {
        id: expect.any(String),
        recipe_id: '2',
        day: 'monday',
        user_id: '1',
      },
    ];
    const remainingRecipe = [
      {
        day: 'monday',
        recipes: [
          {
            id: 1,
            recipeId: 1,
            name: 'banana bread',
          },
        ],
      },
    ];
    const { body } = await agent.delete('/api/v1/planners/delete/2');
    const actualRemaining = await Planner.getRecipesByUser(1);

    expect(body).toEqual(deletedRecipe);
    expect(actualRemaining).toEqual(remainingRecipe);
  });

  it('should get a random recipe', async () => {
    const recipeShape = {
      id: expect.any(String),
      name: expect.any(String),
    };

    const { body } = await agent.get('/api/v1/planners/random');

    expect(body).toEqual(recipeShape);
  });
});
