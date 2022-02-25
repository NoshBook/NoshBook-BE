const { Router } = require('express');
const authenticate = require('../middleware/authenticate.js');
const ShoppingListItem = require('../models/ShoppingListItem.js');

module.exports = Router()
  .get('/', authenticate, async (req, res, next) => {
    try {
      const shoppingList = await ShoppingListItem.getByUserId(req.user.id);
      res.json(shoppingList);
    } catch (e) {
      next(e);
    }
  })
  .get('/new', authenticate, async (req, res, next) => {
    try {
      const shoppingList = await ShoppingListItem.generateForUserId(req.user.id);
      res.json(shoppingList);
    } catch (e) {
      next(e);
    }
  })
  .put('/item/:id', authenticate, async (req, res, next) => {
    try {
      const { id } = req.params;
      const { isChecked } = req.body;
      console.log('shoppingList: ' + isChecked);
      const newShoppingList = await ShoppingListItem.updateIsCheckedById(id, req.user.id, isChecked);
      res.json(newShoppingList);
    } catch (e) {
      next(e);
    }
  });
