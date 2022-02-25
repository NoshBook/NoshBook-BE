const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');

describe('shopping list routes', () => {
  beforeEach(() => {
    return setup(pool);
  });

  afterAll(() => {
    pool.end();
  });

  it('should return an empty shopping list if it hasn\'t been generated', async () => {
    const agent = request.agent(app);
    await agent.post('/api/v1/users/sessions').send({
      username: 'bob',
      password: 'bob'
    });

    const { body } = await agent.get('/api/v1/shoppinglist');

    expect(body).toEqual([]);
  });

  it('should return the correct ingredients after generating a new shopping list', async () => {
    const agent = request.agent(app);
    await agent.post('/api/v1/users/sessions').send({
      username: 'bob',
      password: 'bob'
    });

    const expected = [
      {
        id: '1',
        ingredient: 'banana',
        isChecked: false
      },
      {
        id: '2',
        ingredient: 'bread',
        isChecked: false
      },
      {
        id: '3',
        ingredient: 'corn',
        isChecked: false
      },
      {
        id: '4',
        ingredient: 'dog',
        isChecked: false
      }
    ];

    const { body } = await agent.get('/api/v1/shoppinglist/new');

    expect(body).toEqual(expect.arrayContaining(expected));
  });

  it('should return the same ingredients after changes to the planner', async () => {
    const agent = request.agent(app);
    await agent.post('/api/v1/users/sessions').send({
      username: 'bob',
      password: 'bob'
    });

    const expected = [
      {
        id: '1',
        ingredient: 'banana',
        isChecked: false
      },
      {
        id: '2',
        ingredient: 'bread',
        isChecked: false
      },
      {
        id: '3',
        ingredient: 'corn',
        isChecked: false
      },
      {
        id: '4',
        ingredient: 'dog',
        isChecked: false
      }
    ];

    const newListRes = await agent.get('/api/v1/shoppinglist/new');
    expect(newListRes.body).toEqual(expect.arrayContaining(expected));

    await pool.query('INSERT INTO shopping_list (user_id, ingredient_id) VALUES (1, 1)');

    const existingListRes = await agent.get('/api/v1/shoppinglist');
    expect(existingListRes.body).toEqual(expect.arrayContaining(expected));
  });
});
