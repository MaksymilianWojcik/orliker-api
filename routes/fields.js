const _ = require('lodash');
const express = require('express');
const auth = require('../middleware/auth');
const asyncMiddleware = require('../middleware/async');
const { Field, validate } = require('../models/field');

const Response = require('../utils/responses');

const router = express.Router();

router.get(
  '/',
  auth,
  asyncMiddleware(async (req, res) => {
    const fields = await Field.find().sort('name');
    res.status(200).send(fields);
  })
);

// TODO: think about the proper entities in this model, so we have uniqueness
// TODO: move addres to sepearate schema / model
router.post(
  '/add',
  auth,
  asyncMiddleware(async (req, res) => {
    const { error } = validate(req.body);
    if (error) {
      return res.status(400).send(Response.fieldAddedErrorResponse(error.details[0].message));
    }

    const field = new Field(_.pick(req.body, ['name', 'address', 'city', 'lat', 'lng', 'type']));
    const result = await field.save();

    return res.status(200).send(Response.fieldAddedSuccessResponse(result._id));
  })
);

module.exports = router;
