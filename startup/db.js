const winston = require('winston');
const mongoose = require('mongoose');
const config = require('config');

module.exports = function initMongo() {
  const user = config.get('mongoUser');
  const password = config.get('mongoPassword');
  mongoose
    .connect(
      `mongodb+srv://${user}:${password}@orliker-api-iejpl.mongodb.net/test?retryWrites=true&w=majority`,
      { useNewUrlParser: true }
    )
    .then(() => winston.info('Connected to MongoDB...'))
    .catch(() => winston.error('Couldnt connect to MongoDB...'));
};
