const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');

//declare agent to persist cookies
const agent = request.agent(app);

const mockUser = {
  username: 'bob',
  password: 'bob',
};

describe('cookbook routes', () => {
  beforeEach(() => {
    return setup(pool);
  });

  afterAll(() => {
    pool.end();
  });

  it('should return an array of recipes', async () => {
    // login user to retrieve a cookie
    await agent.post('/api/v1/users/sessions').send(mockUser);

    const addRecipeToCookbookRes = await agent
      .post('/api/v1/cookbooks/add/')
      .send({ userId: 1, recipeId: 1 });
    const actual = addRecipeToCookbookRes.body;

    expect(actual).toEqual({
      id: expect.any(String),
      userId: '1',
      recipeId: '1',
    });
  });

  it('should return recipes in a cookbook according to the user id', async () => {
    await agent.post('/api/v1/users/sessions').send(mockUser);

    await agent.post('/api/v1/cookbooks/add/').send({ userId: 1, recipeId: 1 });
    await agent.post('/api/v1/cookbooks/add/').send({ userId: 1, recipeId: 2 });

    const userrecipesincookbook = await agent.get('/api/v1/cookbooks/1');
    const actual = userrecipesincookbook.body;

    expect(actual).toEqual(
      expect.arrayContaining([
        {
          id: expect.any(String),
          userId: '1',
          recipeId: '1',
        },
        {
          id: expect.any(String),
          userId: '1',
          recipeId: '2',
        },
      ])
    );
  });
});
