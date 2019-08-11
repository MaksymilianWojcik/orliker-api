const config = require('config');

module.exports = function initConfig() {
  if (!config.get('jwtPrivateKey')) {
    // export orliker_privateKey=costamcostamsekretkey
    throw new Error('FATA ERROR: orliker_jwtPrivateKey is not defined');
  }
  if (!config.get('mongoUser') || !config.get('mongoPassword')) {
    throw new Error('FATAL ERROR: orliker_mongoPassword or orliker_mongoUser is not defined');
  }
};
