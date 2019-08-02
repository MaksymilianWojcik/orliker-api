const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
const fields = require('../routes/fields');
const users = require('../routes/users');
const players = require('../routes/players');
const games = require('../routes/games');
const errorMiddleware = require('../middleware/error');

module.exports = function (app) {
    app.use(express.json());
    app.use(helmet());
    if (app.get('env')=== 'development') app.use(morgan('tiny')); //export NODE_ENV=
    app.use('/api/fields', fields);
    app.use('/api/users', users);
    app.use('/api/players', players);
    app.use('/api/games', games);
    app.use(errorMiddleware);
};