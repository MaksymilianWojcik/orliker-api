const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = function authMiddleware(req, res, next) {
  const token = req.header('x-auth-token');
  if (!token)
    return res.status(401).send({ code: 401, message: 'Access denied. No token provided.' }); // 401 - no auth credentials

  try {
    const decoded = jwt.verify(token, config.get('jwtPrivateKey'));
    req.user = decoded;
    return next();
  } catch (e) {
    return res.status(400).send({ code: 400, message: 'Invalid token' });
  }
};
