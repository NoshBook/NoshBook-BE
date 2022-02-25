// import Router from express
// import cookbook class

// module.exports = Router()
//  .post method
//      TRY to...
//          - const await CookBook.addRecipeToCookBook(req.user.id, req.body)
//          - res.json/send({success message})

const { Router } = require('express');
// feel free to change this pathname
module.exports = Router().post('/add', (req, res, next) => {});
