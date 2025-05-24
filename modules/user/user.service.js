const User = require('./user.entity');  

exports.getUsers = async () => {
  return await User.find();
};

exports.getUserById = async (userId) => {
  return await User.findById(userId);
};

exports.createUser = async (userData) => {
  const user = new User(userData);
  await user.save();
  return user;
};

exports.updateUser = async (userId, updateData) => {
  return await User.findByIdAndUpdate(userId, updateData, { new: true });
};

exports.deleteUser = async (userId) => {
  return await User.findByIdAndDelete(userId);
};
