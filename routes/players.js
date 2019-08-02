const express = require("express");
const auth = require("../middleware/auth");
const asyncMiddleware = require("../middleware/async");
const { Player, validate } = require("../models/player");
const { User } = require("../models/user");

const router = express.Router();

router.get(
  "/",
  auth,
  asyncMiddleware(async (req, res) => {
    const players = await Player.find()
      .populate("user", "-password")
      .sort("email");
    res.send(players);
  })
);

router.post(
  "/",
  auth,
  asyncMiddleware(async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const user = await User.findById(req.body.userId);
    if (!user) return res.status(400).send("Invalid user id");

    //TODO: check if it works properly
    let player = await Player.findOne({name: req.body.nickname});
    if (player) return res.status(400).send('Nickname already taken!');

    //const instaed of let - we are not modyfing it
    player = new Player({
      nickname: req.body.nickname,
      respect: req.body.respect,
      premium: req.body.premium,
      user: req.body.userId
    });
    await player.save();
    res.send(player);
  })
);

module.exports = router;
