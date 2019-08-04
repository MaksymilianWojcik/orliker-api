const Joi = require("joi");
const mongoose = require("mongoose");

const Game = mongoose.model(
  'Game',
  new mongoose.Schema({
    name: {
      type: String,
      required: true,
      minlength: 5,
      maxlength: 25
    },
    maxPlayers: {
      type: Number,
      required: true,
      min: 2,
      max: 18,
    },
    minPlayers: {
      type: Number,
      required: true,
      min: 1,
      max: 18,
    },
    players: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: 'User',
    },
    field: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Field'
    },
    private: {
      type: Boolean,
      required: true,
      default: false
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User'
    }
  })
);

function validateGame(game) {
  const schema = {
    name: Joi.string().min(5).max(25).required(),
    maxPlayers: Joi.number().min(2).max(18).required(),
    minPlayers: Joi.number().min(1).max(18).required(),
    players: Joi.array().items(Joi.objectId()),
    fieldId: Joi.objectId().required(),
    private: Joi.boolean().required(),
    ownerId: Joi.objectId().required(),
  };
  return Joi.validate(game, schema);
}

function validateGameUpdate(game) {
  const schema = {
    playerId: Joi.objectId().required(),
    gameId: Joi.objectId().required(),
  };
  return Joi.validate(game, schema);
}

exports.Game = Game;
exports.validate = validateGame;
exports.validateUpdate = validateGameUpdate;
