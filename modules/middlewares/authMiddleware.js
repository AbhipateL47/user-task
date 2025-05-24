const jwt = require('jsonwebtoken');
const userService = require('../user/user.service');

module.exports = function (req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).send('Unauthorized: No token provided');

  const token = authHeader.split(' ')[1]; // Bearer tokenstring
  if (!token) return res.status(401).send('Unauthorized: Invalid token format');

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId; // attach userId to request
    next();
  } catch (err) {
    return res.status(401).send('Unauthorized: Invalid token');
  }
};
