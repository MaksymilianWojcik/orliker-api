const Joi = require('joi');
const mongoose = require('mongoose');

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
    minRespect: {
      type: Number,
      required: false,
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
    password: {
      type: String,
      required: function() { return this.private; }
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
    password: Joi.when('private', {
      is: Joi.boolean().valid(true).required(),
      then: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/).required(),
      otherwise: Joi.forbidden(),
    })
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

module.exports.Game = Game;
module.exports.validate = validateGame;
module.exports.validateUpdate = validateGameUpdate;
