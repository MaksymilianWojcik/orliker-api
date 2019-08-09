const config = require('config');

module.exports = function initConfig() {
  if (!config.get('jwtPrivateKey')) {
    // export orliker_privateKey=costamcostamsekretkey
    throw new Error('FATA ERROR: jwtPrivateKey is not defined');
  }
};
