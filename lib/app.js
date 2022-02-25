const express = require('express');
const cors = require('cors');
const app = express();
const cookieParser = require('cookie-parser');

// Built in middleware
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

// App routes
app.use('/api/v1/recipes', require('./controllers/recipes'));
app.use('/api/v1/users', require('./controllers/users'));
app.use('/api/v1/planners', require('./controllers/planners'));

// Error handling & 404 middleware for when
// a request doesn't match any app routes
app.use(require('./middleware/not-found'));
app.use(require('./middleware/error'));

module.exports = app;
