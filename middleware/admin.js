module.exports = function adminAuthorization(req, res, next) {
  // req.user -> this function will be invoked after auth, soe we have acces to user
  // 401 - unaithorized, so wihtout token, 403-forbidden, when we have no access
  if (!req.user.isAdmin) return res.status(403).send('Access denied.');
  return next(); // if is, we pass control futher (to the orut handler probably);
};
