const _ = require("lodash");
const express = require("express");
const auth = require("../middleware/auth");
const asyncMiddleware = require("../middleware/async");
const { Field, validate } = require("../models/field");
const Response = require("../utils/responses");

const router = express.Router();

//TODO: add try catch on awaits to handle promise rejection, which will shut down the app
router.get(
  "/",
  auth,
  asyncMiddleware(async (req, res, next) => {
    const fields = await Field.find().sort("name");
    res.status(200).send(fields);
  })
);

router.post(
  "/",
  auth,
  asyncMiddleware(async (req, res) => {
    const { error } = validate(req.body);

    //because of asyncMIddleware this whole block can be removed, cause our error will jump to error midleware
    if (error)
      return res
        .status(400)
        .send(Response.fieldAddedErrorResponse(error.details[0].message));
    const field = new Field(_.pick(req.body, ["name", "address", "lat", "lng", "type"]))
    const result = await field.save();
    console.log(result);
    res.status(200).send(Response.fieldAddedSuccessResponse(result._id));
  })
);

module.exports = router;
