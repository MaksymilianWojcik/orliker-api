const _ = require('lodash');
const Bcrypt = require('bcryptjs');
const express = require('express');
const { User, validateAuth, validatePasswordChange } = require('../models/user');
const Response = require('../utils/responses');
const asyncMiddleware = require('../middleware/async');

const router = express.Router();

router.post(
  '/register',
  asyncMiddleware(async (req, res) => {
    const { error } = validateAuth(req.body);
    if (error) {
      return res.status(400).send(Response.fieldAddedErrorResponse(error.details[0].message));
    }

    let user = await User.findOne({ email: req.body.email });
    if (user) return res.status(400).send({ code: 400, error: 'User already registered' });

    user = new User(_.pick(req.body, ['email', 'password']));
    const salt = await Bcrypt.genSalt(10);
    user.password = await Bcrypt.hash(user.password, salt);

    const result = await user.save();
    // we want to immediately set token after registering
    const token = user.generateAuthToken();
    return res
      .status(200)
      .header('x-auth-token', token)
      .send(_.pick(result, ['_id', 'email']));
  }),
);

router.post(
  '/login',
  asyncMiddleware(async (req, res) => {
    const { error } = validateAuth(req.body);
    if (error) {
      return res.status(400).send(Response.fieldAddedErrorResponse(error.details[0].message));
    }

    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(400).send({ code: 400, error: 'Invalid email or password' });
    }

    const validPassword = await Bcrypt.compare(req.body.password, user.password);

    if (!validPassword) {
      return res.status(400).send({ code: 400, error: 'Invalid email or password' });
    }

    const token = user.generateAuthToken();
    return res
      .status(200)
      .header('x-auth-token', token)
      .send({ message: 'Succesfully logged in', token });
  }),
);

router.put(
  '/changepassword',
  asyncMiddleware(async (req, res) => {
    const { error } = validatePasswordChange(req.body);
    if (error) {
      return res.status(400).send({ code: 400, error: error.details[0].message });
    }

    if (req.body.oldpassword === req.body.newpassword) {
      return res.status(400).send({ code: 400, error: 'New password must be different than the old one' });
    }

    let user = await User.findOne({ email: req.body.email }); // or by id?
    if (!user) {
      return res.status(400).send({ code: 400, error: 'Invalid email or old password' });
    }

    const validPassword = await Bcrypt.compare(req.body.oldpassword, user.password);
    if (!validPassword) {
      return res.status(400).send({ code: 400, error: 'Invalid email or old assword' });
    }

    const salt = await Bcrypt.genSalt(10);
    const newPassword = await Bcrypt.hash(req.body.newpassword, salt);

    user = await User.updateOne(
      { email: user.email },
      { $set: { password: newPassword } },
    ).exec();

    // user.password = newPassword;
    // user = await user.save();

    return res.status(200).send(user);
  }),
);


// TODO: implement email sending
router.get(
  '/forgottenpassword',
  asyncMiddleware(async (req, res) => {
    // TODO: validation for email
    const user = User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(400).send('Invalid email address'); // Do we want to show that info?
    }

    // TODO: here send an email with password
    return res.status(200).send('Email has been sent');
  }),
);

module.exports = router;
