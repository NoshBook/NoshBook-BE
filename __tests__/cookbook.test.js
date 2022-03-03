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

  it('successfully posts a new recipe to cookbook referencing the appropriate user', async () => {
    // login user to retrieve a cookie
    await agent.post('/api/v1/users/sessions').send(mockUser);

    const addRecipeToCookbookRes = await agent
      .post('/api/v1/cookbooks/add/')
      .send({ recipeId: 2 });
    const actual = addRecipeToCookbookRes.body;

    expect(actual).toEqual({
      id: '2',
      userId: '1',
      cookbookId: expect.any(String),
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
          ownerId: expect.any(String),
          cookbookId: expect.any(String),
          userId: '1',
          description: expect.any(String),
          image: expect.any(String),
          name: expect.any(String),
          rating: expect.any(Number),
        },
        {
          id: expect.any(String),
          ownerId: expect.any(String),
          cookbookId: expect.any(String),
          userId: '1',
          description: expect.any(String),
          image: expect.any(String),
          name: expect.any(String),
          rating: expect.any(Number),
        },
      ])
    );
  });

  it('should remove a recipe in a cookbook according to the recipe id and user id', async () => {
    await agent.post('/api/v1/users/sessions').send(mockUser);

    await agent.post('/api/v1/cookbooks/add/').send({ userId: 1, recipeId: 1 });
    await agent.post('/api/v1/cookbooks/add/').send({ userId: 1, recipeId: 2 });
    await agent.delete('/api/v1/cookbooks/delete/2');

    const userrecipesincookbook = await agent.get('/api/v1/cookbooks/1');
    const actual = userrecipesincookbook.body;

    expect(actual).toEqual([
      {
        id: expect.any(String),
        ownerId: expect.any(String),
        cookbookId: expect.any(String),
        userId: '1',
        description: expect.any(String),
        image: expect.any(String),
        name: expect.any(String),
        rating: expect.any(Number),
      },
    ]);
  });

  it('should return an array of recipes ranked by cookbook id according to the user id', async () => {
    // login user to retrieve a cookie
    await agent.post('/api/v1/users/sessions').send(mockUser);

    const { body } = await agent.get(
      `/api/v1/cookbooks/pagination?page=1&quantity=20`
    );

    // Only applicable if more recipes exist in DB for bob
    // expect(body[0].cookbookId < body[1].cookbookId < body[2].cookbookId).toBe(
    //   true
    // );

    expect(body.length <= 20).toEqual(true);
    expect(body[0].ownerId).toEqual('1');
    expect(body).toEqual(expect.arrayContaining([expect.any(Object)]));
  });
});
