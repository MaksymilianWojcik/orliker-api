const express = require("express");
const auth = require("../middleware/auth");
const asyncMiddleware = require("../middleware/async");
const { Field, validate } = require("../models/field");
const Responses = require("../utils/responses");

const router = express.Router();

//TODO: add try catch on awaits to handle promise rejection, which will shut down the app
router.get(
  "/",
  auth,
  asyncMiddleware(async (req, res, next) => {
    // try { //try and catch replaced by asyncMiddleware
    const fields = await Field.find().sort("name");
    res.status(200).send(fields);
    // } catch (e) {
    //   //TODO: Logs
    //   // res.status(500).send("Something went wrong.."); -> create error middleware in index.js
    //   next(e); //passing it to our middleware
    //   //how next(e) here works? it works because I registered it after the routes middlewares, so
    //   //next will be the error middelware.
    // }
  })
);

router.post(
  "/",
  auth,
  asyncMiddleware(async (req, res) => {
    const { error } = validate(req.body);
    if (error)
      return res
        .status(400)
        .send(Responses.fieldAddedErrorResponse(error.details[0].message));
    let field = new Field({
      name: req.body.name,
      address: req.body.address,
      lat: req.body.lat,
      lng: req.body.lng,
      type: req.body.type
    });

    // try {
    const result = await field.save();
    console.log(result);
    res.status(200).send(Responses.fieldAddedSuccessResponse(result._id));
    // } catch (e) {
    //   res.status(400).send(Responses.fieldAddedErrorResponse(e.message))
    // }
  })
);

module.exports = router;
