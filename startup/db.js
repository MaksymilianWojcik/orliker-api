const winston = require('winston');
const mongoose = require('mongoose');

module.exports = function initMongo() {
  mongoose
    .connect('mongodb://localhost/orliker', { useNewUrlParser: true })
    .then(() => winston.info('Connected to MongoDB...'));
};
