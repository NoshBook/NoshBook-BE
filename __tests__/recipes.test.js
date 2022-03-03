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
  totalTime: null,
  servings: expect.any(String),
  image: expect.any(String),
  rating: expect.any(Number),
  ratingsCount: expect.any(Number),
  sourceUrl: null,
};

const testRecipe = {
  name: 'bananabread',
  ingredients: ['bread', 'banana'],
  instructions: ['insert piece of banana into bread', 'repeat until out of banana'],
  tags: ['corn', 'bread', 'vegan', 'gluten free', 'non gmo'],
  description: 'an advanced recipe for skilled cooks',
  totalTime: '2',
  servings: 'sure',
  image: 'picture.com/picture2'
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
      expect.arrayContaining([expect.objectContaining({ ...mockRecipe, ownerId: null })])
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

  it('should return a recipe by id', async () => {
    const { body } = await request(app).get('/api/v1/recipes/1');

    expect(body.name).toEqual('banana bread');
  });

  it('should correctly update the rating on a recipe', async () => {
    const agent = request.agent(app);
    await agent
      .post('/api/v1/users/sessions')
      .send({ username: 'bob', password: 'bob' });

    await agent.post('/api/v1/recipes/3/ratings').send({ rating: 5 });
    const getRes1 = await agent.get('/api/v1/recipes/3');
    expect(getRes1.body.rating).toEqual(5);

    await agent.post('/api/v1/recipes/3/ratings').send({ rating: 4 });
    const getRes2 = await agent.get('/api/v1/recipes/3');
    expect(getRes2.body.rating).toEqual(4.5);
  });

  it('should edit a user owned recipe in their cookbook', async () => {
    const agent = request.agent(app);
    await agent.post('/api/v1/users/sessions').send({ username: 'bob', password: 'bob' });

    await agent.put('/api/v1/recipes/1').send({ recipe: testRecipe });
    
    const getRes1 = await agent.get('/api/v1/recipes/1'); 
    expect(getRes1.body).toEqual(expect.objectContaining(testRecipe));
  });

  it('should throw an error when a user edits a recipe that\'s not in their cookbook', async () => {
    const agent = request.agent(app);
    await agent.post('/api/v1/users/sessions').send({ username: 'bob', password: 'bob' });
    
    const res = await agent.put('/api/v1/recipes/2').send({ recipe: testRecipe });
    expect(res.statusCode).toBe(500);
  });

  it('should duplicate a recipe and replace it in their cookbook if they edit someone elses recipe', async () => {
    const agent = request.agent(app);
    await agent.post('/api/v1/users/sessions').send({ username: 'bob', password: 'bob' });

    await agent.post('/api/v1/cookbooks/add').send({
      recipeId: 2,
      userId: 1
    });

    const res = await agent.put('/api/v1/recipes/2').send({ recipe: testRecipe });
    expect(res.body.message).toBe('success');
    expect(res.body.id).not.toBe('2');
    expect(res.body.id).not.toBe(2);

    const cookBookRes = await agent.get('/api/v1/cookbooks/1');

    const cbRecipes = await Promise.all(cookBookRes.body.map(async (cb) => {
      const recipeRes = await agent.get(`/api/v1/recipes/${cb.id}`);
      return recipeRes.body;
    }));
    expect(cbRecipes[1]).toEqual(expect.objectContaining(testRecipe));
  });
});
