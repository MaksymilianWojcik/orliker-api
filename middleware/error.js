const winston = require('winston');
const Text = require('../utils/Text');

module.exports = function(err, req, res) {
    winston.error(err.message, err); //err payload is passed too
    //error -> warn -> info -> verbose -> debug -> silly
    res.status(500).send({error: err.message, message: Text.response.error.code_500});
};