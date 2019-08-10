const winston = require('winston');
const Text = require('../utils/Text');

// eslint-disable-next-line no-unused-vars
module.exports = function errorMiddleware(err, req, res, next) {
  winston.error(err.message, err); // err payload is passed too
  // error -> warn -> info -> verbose -> debug -> silly
  return res.status(500).send({ error: err.message, message: Text.response.error.code_500 });
};
