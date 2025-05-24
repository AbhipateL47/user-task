const jwt = require('jsonwebtoken');
const userService = require('../user/user.service');

module.exports = function (req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).send('Unauthorized: No token provided');

  const token = authHeader.split(' ')[1];
  if (!token) return res.status(401).send('Unauthorized: Invalid token format');

  try {
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        console.log("JWT verification failed:", err);
        return res.status(401).json({ message: 'Invalid or expired token' });
      }
      // console.log(decoded)
      req.user = decoded.user;
      // console.log(req.user)
      next();
    });
  } catch (err) {
    return res.status(401).send('Unauthorized: Invalid token');
  }
};
