const Joi = require('joi');

module.exports = function initJoiObjectValidation() {
  // eslint-disable-next-line global-require
  Joi.objectId = require('joi-objectid')(Joi); // for validating object ids
};
