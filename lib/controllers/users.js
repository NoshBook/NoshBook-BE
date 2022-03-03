const { Router } = require('express');
const authenticate = require('../middleware/authenticate');
const User = require('../models/User');
const UserService = require('../services/UserService');

const ONE_DAY_IN_MS = 1000 * 60 * 60 * 24;

module.exports = Router()
  .post('/', async (req, res, next) => {
    try {
      const user = await UserService.create(req.body);
      res.json(user);
    } catch (error) {
      next(error);
    }
  })

  .post('/sessions', async (req, res, next) => {
    try {
      const { username, password } = req.body;
      const sessionToken = await UserService.signIn({ username, password });

      res
        .cookie(process.env.COOKIE_NAME, sessionToken, {
          secure: process.env.NODE_ENV === 'production',
          httpOnly: true,
          maxAge: ONE_DAY_IN_MS,
          sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
        })
        .json({ message: 'Signed in successfully!' });
    } catch (error) {
      next(error);
    }
  })

  .get('/me', authenticate, async (req, res, next) => {
    try {
      res.json(req.user);
    } catch (error) {
      next(error);
    }
  })

  .delete('/sessions', (req, res) => {
    res
      .clearCookie(process.env.COOKIE_NAME, {
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
      })
      .json({ success: true, message: 'Signed out successfully!' });
  })

  .delete('/:id', async (req, res) => {
    const { id } = req.params;
    const userToDelete = await User.getById(id);
    await User.deleteById(id);
    res.json({
      success: true,
      message: `Deleted user with id of ${userToDelete.id}`,
    });
  });
