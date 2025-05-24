const userService = require('../user/user.service');

exports.register = async (userData) => {
  const existing = await userService.findByEmail(userData.email);
  if (existing) throw new Error('Email already exists');
  const user = await userService.createUser(userData);
  const token = userService.generateToken(user);
  return { user, token };
};

exports.login = async (email, password) => {
  const user = await userService.findByEmail(email);
  if (!user) throw new Error('Invalid credentials');
  const valid = await userService.validatePassword(user, password);
  if (!valid) throw new Error('Invalid credentials');
  const token = userService.generateToken(user);
  return { user, token };
};
