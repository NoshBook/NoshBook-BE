const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');
const User = require('../lib/models/User');

const agent = request.agent(app);

//Dummy user for testing
const mockUser = {
  username: 'testusernameA',
  password: 'testpassword',
};

describe('NoshBook user routes', () => {
  beforeAll(() => {
    return setup(pool);
  });

  afterAll(() => {
    pool.end();
  });

  it('creates a new user', async () => {
    const res = await agent.post('/api/v1/users').send(mockUser);
    const { username } = mockUser;

    expect(res.body).toEqual({
      id: expect.any(String),
      username,
      showUserContent: false,
    });
  });

  it('logs a user in', async () => {
    const res = await agent.post('/api/v1/users/sessions').send(mockUser);

    expect(res.body).toEqual({ message: 'Signed in successfully!' });
  });

  it('displays user info', async () => {
    const res = await agent.get('/api/v1/users/me');
    const { username } = mockUser;

    expect(res.body).toEqual({
      exp: expect.any(Number),
      iat: expect.any(Number),
      id: expect.any(String),
      username,
      showUserContent: false,
    });
  });

  it('clears a session', async () => {
    const res = await agent.delete('/api/v1/users/sessions');
    expect(res.body).toEqual({
      success: true,
      message: 'Signed out successfully!',
    });
  });

  it('deletes a user', async () => {
    //get mock user id
    const user = await User.getByUsername('testusernameA');
    const res = await agent.delete(`/api/v1/users/${user.id}`);
    expect(res.body).toEqual({
      success: true,
      message: `Deleted user with id of ${user.id}`,
    });

    //look for user in database
    const deletedUser = await User.getByUsername('testusernameA');
    expect(deletedUser).toBeNull;
  });
});
