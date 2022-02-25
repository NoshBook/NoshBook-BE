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
    const { body } = await request(app).get('/api/v1/shoppinglist');

    expect(body).toEqual([]);
  });

  it('should return the correct ingredients after generating a new shopping list', async () => {
    const expected = [
      'corn',
      'dog',
      'banana',
      'bread'
    ];

    const { body } = await request(app).get('/api/v1/shoppinglist/new');

    expect(body).toEqual(expect.arrayContaining(expected));
  });

  it('should return the correct ingredients after getting an existing shopping list', async () => {
    const expected = [
      'corn',
      'dog',
      'banana',
      'bread'
    ];

    const newListRes = await request(app).get('/api/v1/shoppinglist/new');
    expect(newListRes.body).toEqual(expect.arrayContaining(expected));

    const existingListRes = await request(app).get('/api/v1/shoppinglist');
    expect(existingListRes.body).toEqual(expect.arrayContaining(expected));
  });
});
