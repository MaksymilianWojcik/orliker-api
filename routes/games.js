const _ = require('lodash');
const express = require('express');
const auth = require('../middleware/auth');
const asyncMiddleware = require('../middleware/async');
const { Game, validate, validateUpdate } = require('../models/game');
const { Field } = require('../models/field');
const { User } = require('../models/user');

const router = express.Router();

router.get(
  '/',
  auth,
  asyncMiddleware(async (req, res) => {
    const games = await Game.find()
      .select('-password')
      .sort('name')
      .populate('owner field', 'email name');
    res.status(200).send(games);
  })
);

router.post(
  '/add',
  auth,
  asyncMiddleware(async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send({ code: 400, message: error.details[0].message });

    let game = await Game.findOne({ name: req.body.name });
    if (game)
      return res.status(400).send({ code: 400, message: 'Game with this name already registered' });

    const field = await Field.findById(req.body.fieldId);
    if (!field) return res.status(400).send({ code: 400, message: 'Invalid field id' });

    const owner = await User.findById(req.body.ownerId);
    if (!owner) return res.status(400).send({ code: 400, message: 'Invalid owner id' });

    game = new Game({
      name: req.body.name,
      maxPlayers: req.body.maxPlayers,
      minPlayers: req.body.minPlayers,
      field: req.body.fieldId,
      private: req.body.private,
      password: req.body.password,
      owner: req.body.ownerId
    });

    game = await game.save();
    const result = _.pick(game, [
      '_id',
      'name',
      'maxPlayers',
      'minPlayers',
      'field',
      'private',
      'owner'
    ]);
    return res.send(result);
  })
);

router.put(
  '/joingame',
  auth,
  asyncMiddleware(async (req, res) => {
    const { error } = validateUpdate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const player = await User.findById(req.body.playerId);
    if (!player) return res.status(400).send({ code: 400, message: 'Invalid player id' });

    let game = await Game.findById(req.body.gameId);
    if (game.players.includes(player._id)) {
      return res.status(400).send({ code: 400, message: 'User already in the game' });
    }

    game = await Game.findByIdAndUpdate(
      { _id: req.body.gameId },
      {
        $addToSet: {
          // $addToSet - for unique values, not like $push
          players: player._id
        }
      },
      { new: true }
    ).select('-password');
    if (!game) {
      return res.status(400).send({ code: 400, message: "Game doesn't exist" });
    }

    // TODO: update also user 'games' field

    return res.status(200).send(game);
  })
);

router.put(
  '/exitgame',
  auth,
  asyncMiddleware(async (req, res) => {
    const { error } = validateUpdate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const player = await User.findById(req.body.playerId);
    if (!player) return res.status(400).send('Invalid player id');

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
    ).select('-password');
    if (!game) {
      return res.status(400).send('Invalid game id, cannot remove player from the game');
    }

    // is it safe?
    // game.players.push(player._id);
    // game.save();
    return res.status(200).send(game);
  })
);

module.exports = router;
