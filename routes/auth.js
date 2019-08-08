const _ = require('lodash');
const Bcrypt = require('bcryptjs');
const express = require('express');
const { User, validate } = require('../models/user');
const Response = require('../utils/responses');
const asyncMiddleware = require('../middleware/async');
const router = express.Router();

router.post(
  '/register',
  asyncMiddleware(async (req, res) => {
    const { error } = validate(req.body);
    if (error)
      return res
        .status(400)
        .send(Response.fieldAddedErrorResponse(error.details[0].message));

    let user = await User.findOne({ email: req.body.email });
    if (user) return res.status(400).send('User already registered');

    user = new User(_.pick(req.body, ['email', 'password']));
    const salt = await Bcrypt.genSalt(10);
    user.password = await Bcrypt.hash(user.password, salt);
    //   const password = Bcrypt.hashSync(req.body.password, 10);

    const result = await user.save();
    console.log(result);

    //if we want to immediately set token after registering
    const token = user.generateAuthToken();
    res
      .status(200)
      .header('x-auth-token', token)
      .send(_.pick(user, ['_id", "email']));
  })
);

router.post(
  '/login',
  asyncMiddleware(async (req, res) => {
    const { error } = validate(req.body);
    if (error)
      return res
        .status(400)
        .send(Response.fieldAddedErrorResponse(error.details[0].message));

    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(400).send({ message: 'Invalid email or password' });
    }

    const validPassword = await Bcrypt.compare(
      req.body.password,
      user.password
    );

    if (!validPassword)
      return res.status(400).send('Invalid email or password');

    const token = user.generateAuthToken();
    res
      .status(200)
      .header('x-auth-token', token)
      .send({ message: 'Succesfully logged in', token });
  })
);

module.exports = router;
