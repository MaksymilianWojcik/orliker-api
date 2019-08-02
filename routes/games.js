const express = require("express");
const auth = require("../middleware/auth");
const asyncMiddleware = require("../middleware/async");
const { Game, validate, validateUpdate } = require("../models/game");
const { Field } = require("../models/field");
const { Player } = require("../models/player");

const router = express.Router();

router.get(
  "/",
  auth,
  asyncMiddleware(async (req, res) => {
    const games = await Game.find().sort("name");
    res.status(200).send(games);
  })
);

router.post(
  "/",
  auth,
  asyncMiddleware(async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const field = Field.findById(req.body.fieldId);
    if (!field) return res.status(400).send("Invalid field id");

    const onwer = Field.findById(req.body.onwerId);
    if (!onwer) return res.status(400).send("Invalid owner id");

    const game = new Game({
      name: req.body.name,
      maxPlayers: req.body.maxPlayers,
      minPlayers: req.body.minPlayers,
      field: req.body.fieldId,
      private: req.body.private,
      owner: req.body.ownerId
    });
    await game.save();
    res.send(game);
  })
);

router.put(
  "/joingame",
  auth,
  asyncMiddleware(async (req, res) => {
    const { error } = validateUpdate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let player = await Player.findById(req.body.playerId);
    if (!player) return res.status(400).send("Invalid player id");

    const game = await Game.findByIdAndUpdate(
      req.body.gameId,
      {
        $push: {
          players: player._id
        }
      },
      { new: true }
    );
    if (!game)
      return res
        .status(400)
        .send("Invalid game id, cannot add player to the game");

    res.status(200).send(game);
  })
);

router.put(
  "/exitgame",
  auth,
  asyncMiddleware(async (req, res) => {
    const { error } = validateUpdate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let player = await Player.findById(req.body.playerId);
    if (!player) return res.status(400).send("Invalid player id");

    const game = await Game.findByIdAndUpdate(
      req.body.gameId,
      {
        $pull: {
          players: {
            $in: [player._id]
          }
        }
      },
      { new: true }
    );
    if (!game)
      return res
        .status(400)
        .send("Invalid game id, cannot remove player from the game");

    // is it safe?
    // game.players.push(player._id);
    // game.save();
    res.status(200).send(game);
  })
);

module.exports = router;
