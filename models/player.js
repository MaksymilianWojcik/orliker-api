const Joi = require("joi");
const mongoose = require("mongoose");

const Player = mongoose.model(
  "Player",
  new mongoose.Schema({
    nickname: {
      type: String,
      required: true,
      minLength: 5,
      maxlength: 25
    },
    respect: {
      type: Number,
      required: true,
      default: 0
    },
    premium: {
      type: Boolean,
      required: false,
      default: false
    },
    games: {
      type: [mongoose.Schema.Types.ObjectId],
      required: false
    },
    user: { //remember to check in routes if user exists before saving the player
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  })
);

function validatePlayer(player) {
  const schema = {
    nickname: Joi.string().min(5).max(25).required(),
    respect: Joi.number().default(0),
    premium: Joi.boolean().default(false),
    games: Joi.array().items(Joi.string()), //TODO validate object ids
    userId: Joi.objectId().required(),
  };
  return Joi.validate(player, schema);
}

// async function addGameToGamesArray(playerId, game /*or gameId*/){
//   const player = await Player.findById(playerId);
//   course.games.push(game)
//   player.save();
// }

// async function removeGameFromGamesArray(playerId, gameId){
//   const player = await Player.findById(playerId);
//   const game = course.games.id(gameId)
//   game.remove();
//   player.save();
// }

exports.Player = Player;
exports.validate = validatePlayer;
/*
TODO:
- Add OwnedGames schema relation
- Add AttendingGames schema relation
- Add user relation by user id
*/
