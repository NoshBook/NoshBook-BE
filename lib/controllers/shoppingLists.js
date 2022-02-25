const { Router } = require('express');

module.exports = Router()
  .get('/', async (req, res, next) => {
    try {
      // get existing shopping list
    } catch (e) {
      next(e);
    }
  })
  .get('/new', async (req, res, next) => {
    try {
      // generate new shopping list
    } catch (e) {
      next(e);
    }
  });
