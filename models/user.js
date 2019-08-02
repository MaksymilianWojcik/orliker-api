const Joi = require("joi");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const config = require("config");

mongoose.set("useCreateIndex", true);

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true,
    minlength: 5,
    maxlength: 50
  },
  password: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 255
  },
  isAdmin: Boolean
  //roles: [String] or operations: ['delete', 'add'] etc
});

userSchema.methods.generateAuthToken = function() {
  return jwt.sign(
    { _id: this._id, email: this.email },
    config.get("jwtPrivateKey")
  );
};

const User = mongoose.model("User", userSchema);

function validateUser(player) {
  const schema = {
    email: Joi.string()
      .email({ minDomainAtoms: 2 })
      .required(),
    password: Joi.string()
      .regex(/^[a-zA-Z0-9]{3,30}$/)
      .required(),
    token: Joi.string() //[Joi.string(), Joi.number()], //string or number
  };
  return Joi.validate(player, schema);
}

exports.User = User;
exports.validate = validateUser;

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
