const _ = require("lodash");
const express = require("express");
const { User, validate } = require("../models/user");
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

router.get(
  "/:id",
  // auth,
  asyncMiddleware(async (req, res) => {
    const player = await User.findById(req.params.id)
      .select("-_id -password")
      .sort("email");
    if (!player) return res.status(400).send("Player not found")
    res.send(player);
  })
);

module.exports = router;
