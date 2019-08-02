const _ = require("lodash");
const Bcrypt = require("bcryptjs");
const express = require("express");
const { User, validate } = require("../models/user");
const Responses = require("../utils/responses");
const auth = require("../middleware/auth");
const asyncMiddleware = require("../middleware/async");
const router = express.Router();
const fs = require("fs"); //TODO: KEY GENERATED AND STORED IN SEPARATE FILE

router.get(
  "/allusers",
  auth,
  asyncMiddleware(async (req, res) => {
    //TODO: add asyncMIddleware to all try and catches
    const users = await User.find()
      .sort("name")
      .select("-password");
    res.send(users);
  })
);

router.get(
  "/me",
  auth,
  asyncMiddleware(async (req, res) => {
    // we will never get to route handler if token is invalid, but if we do we have req.user
    const user = await User.findById(req.user._id).select("-password");
    res.send(user);
  })
);

router.post("/register", async (req, res) => {
  const { error } = validate(req.body);
  if (error)
    return res
      .status(400)
      .send(Responses.fieldAddedErrorResponse(error.details[0].message));

  let user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).send("User already registered");

  user = new User(_.pick(req.body, ["email", "password"]));
  const salt = await Bcrypt.genSalt(10);
  user.password = await Bcrypt.hash(user.password, salt);
  //   const password = Bcrypt.hashSync(req.body.password, 10);

  try {
    const result = await user.save();
    console.log(result);

    //if we want to immediately set token after registering
    const token = user.generateAuthToken();
    res
      .status(200)
      .header("x-auth-token", token)
      .send(_.pick(user, ["_id", "email"]));
    // res.status(200).send(Responses.fieldAddedSuccessResponse(result._id));
  } catch (e) {
    res.status(400).send(Responses.fieldAddedErrorResponse(e.message));
  }
});

router.post("/login", async (req, res) => {
  const { error } = validate(req.body);
  if (error)
    return res
      .status(400)
      .send(Responses.fieldAddedErrorResponse(error.details[0].message));

  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(400).send({ message: "Invalid email or password" });
    }

    const validPassword = await Bcrypt.compare(
      req.body.password,
      user.password
    );

    if (!validPassword)
      return res.status(400).send("Invalid email or password");

    const token = user.generateAuthToken();
    res.status(200).send({ message: "Succesfully logged in", token });
  } catch (e) {
    res.status(400).send(Responses.fieldAddedErrorResponse(e.message));
  }
});

module.exports = router;
