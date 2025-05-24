const bcrypt = require('bcrypt');
const userModel = require("../models/userModel");

const getUsers = async (req, res) => {
  const users = await userModel.find().sort({ createdAt: -1 });
  res.status(200).json(users);
}

const getUser = async (req, res) => {
  const { id } = req.params;
  if (id) {
    const user = await userModel.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user);
  } else {
    return res.status(400).json({ message: 'User ID is required' });
  }
}

const createUser = async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }
  
  const existingUser = await userModel.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ message: 'User already exists' });
  }
  
  const hashedPassword = await bcrypt.hash(password, 10);
  console.log(hashedPassword);

  const newUser = await userModel.create({
    username,
    email,
    password: hashedPassword,
  });

  res.status(201).json(newUser);
};

const updateUser = async (req, res) => {
  const { id } = req.params;
  if (id) {
    const { username, email, password } = req.body;

    const user = await userModel.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (username) {
      user.username = username;
    }
    if (email) {
      const existingUser = await userModel
        .findOne({ email })
        .where('_id')
        .ne(id);
      if (existingUser) {
        return res.status(400).json({ message: 'Email already exists' });
      }
      user.email = email;
    }
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      user.password = hashedPassword;
    }

    user.updatedAt = new Date();
    await user.save();
    res.status(200).json(user);
  }
}

const deleteUser = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ message: 'User ID is required' });
  }

  try {
    const user = await userModel.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    await userModel.deleteOne({ _id: id });
    
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: 'An error occurred while deleting the user' });
  }
}


module.exports = {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
};