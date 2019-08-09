const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
const fields = require('../routes/fields');
const users = require('../routes/users');
const games = require('../routes/games');
const auth = require('../routes/auth');
const errorMiddleware = require('../middleware/error');

module.exports = function initRoutes(app) {
  app.use(express.json());
  app.use(helmet());
  if (app.get('env') === 'development') app.use(morgan('tiny')); // export NODE_ENV=
  app.use('/api/fields', fields);
  app.use('/api/users', users);
  app.use('/api/games', games);
  app.use('/api/auth', auth);
  app.use(errorMiddleware);
};
