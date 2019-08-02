const Joi = require('joi');

module.exports = function() {
  Joi.objectId = require("joi-objectid")(Joi); // for validating object ids
};
