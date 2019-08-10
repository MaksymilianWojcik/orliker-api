const Joi = require('joi');
const mongoose = require('mongoose');

// soft moody field, natural grass, artifical grass, hard dry pitch, artificial turf, street soccer
const fieldTypes = ['SMF', 'NG', 'AG', 'HDP', 'AT', 'SS'];

const Field = mongoose.model(
  'Field',
  new mongoose.Schema(
    {
      name: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50
      },
      address: {
        // as a street and building / flat number
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50
      },
      city: {
        // TODO: Intagrate something like Google Places ?
        type: String,
        required: true
      },
      lat: {
        type: Number,
        required: true
      },
      lng: {
        type: Number,
        required: true
      },
      type: {
        type: String,
        required: true,
        enum: fieldTypes
      }
    },
    {
      timestamps: true
    }
  )
);

function validateField(field) {
  const schema = {
    name: Joi.string()
      .min(5)
      .max(50)
      .required(),
    address: Joi.string()
      .min(5)
      .max(50)
      .required(),
    city: Joi.string().required(),
    lat: Joi.number().required(),
    lng: Joi.number().required(),
    type: Joi.string()
      .valid(fieldTypes)
      .required()
  };
  return Joi.validate(field, schema);
}

module.exports.Field = Field;
module.exports.validate = validateField;
