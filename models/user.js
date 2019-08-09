const Joi = require('joi');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const config = require('config');

mongoose.set('useCreateIndex', true);

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true,
    minlength: 5,
    maxlength: 50,
  },
  password: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 255,
  },
  isAdmin: Boolean,
  // roles: [String] or operations: ['delete', 'add'] etc
  nickname: {
    type: String,
    required: true,
    minLength: 5,
    maxlength: 25,
  },
  respect: {
    type: Number,
    required: true,
    default: 0,
  },
  premium: {
    type: Boolean,
    required: false,
    default: false,
  },
  games: {
    type: [mongoose.Schema.Types.ObjectId],
    required: false,
  },
});

// eslint-disable-next-line func-names
userSchema.methods.generateAuthToken = function () {
  return jwt.sign({ _id: this._id, email: this.email }, config.get('jwtPrivateKey'));
};

const User = mongoose.model('User', userSchema);

function validateUser(user) {
  const schema = {
    email: Joi.string()
      .email({ minDomainAtoms: 2 })
      .required(),
    password: Joi.string()
      .regex(/^[a-zA-Z0-9]{3,30}$/)
      .required(),
    token: Joi.string(), // [Joi.string(), Joi.number()], //string or number
    nickname: Joi.string()
      .min(5)
      .max(25),
    respect: Joi.number().default(0),
    premium: Joi.boolean().default(false),
    games: Joi.array().items(Joi.objectId()),
  };
  return Joi.validate(user, schema);
}

// TODO: should create and move this to separate auth model? (even tho not storing in db?)
function validateAuth(user) {
  const schema = {
    email: Joi.string()
      .email({ minDomainAtoms: 2 })
      .required(),
    password: Joi.string()
      .regex(/^[a-zA-Z0-9]{3,30}$/)
      .required(),
  };
  return Joi.validate(user, schema);
}

module.exports.User = User;
module.exports.validate = validateUser;
module.exports.validateAuth = validateAuth;

/*
_id: 5a734574ag74347567841e6a

12 bytes:
  4: timestamp
  3: machine identifier
  2: process identifier
  3: counter

  //we can geenrate new id like this
  const id = new mongoose.Types.ObjectId();
  const timestamp = id.getTimestamp();
const isValid = mongoose.Types.ObjectId.isValid('1234') //ofc this is not valid, we will get fasle
*/

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
