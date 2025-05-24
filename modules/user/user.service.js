const User = require('./user.entity');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.createUser = async (userData) => {
  const hashed = await bcrypt.hash(userData.password, 10);
  userData.password = hashed;
  const user = new User(userData);
  await user.save();
  return user;
};

exports.findByEmail = async (email) => {
  return await User.findOne({ email });
};

exports.findById = async (id) => {
  return await User.findById(id).select('-password');
};

exports.validatePassword = async (user, plainPassword) => {
  return await bcrypt.compare(plainPassword, user.password);
};

exports.generateToken = (user) => {
  return jwt.sign({ id: user._id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '7d' });
};


exports.getUsers = async () => {
  return await User.find();
};

exports.getUserById = async (userId) => {
  return await User.findById(userId);
};
exports.updateUser = async (userId, updateData) => {
  return await User.findByIdAndUpdate(userId, updateData, { new: true });
};

exports.deleteUser = async (userId) => {
  return await User.findByIdAndDelete(userId);
};
