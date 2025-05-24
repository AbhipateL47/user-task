const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../../models/userModel');
const authController = require('./auth.controller');
const jwt = require('jsonwebtoken');

// View-based login/register with session
router.get('/login', (req, res) => {
  res.render('login', { title: 'Login', error: null });
});

router.post('/auth/login', async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user || !user.password) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(req.body.password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    // create JWT token with userId payload
    const token = jwt.sign({ id: user._id, user }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.json({ token, username: user.username, email: user.email });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/register', (req, res) => {
  res.render('register', { title: 'Register', error: null });
});

router.post('/auth/register', async (req, res) => {
  const { username, email, password } = req.body;
  const exists = await User.findOne({ email });
  if (exists) return res.render('register', { title: 'Register', error: 'Email already in use' });

  const passwordHash = await bcrypt.hash(password, 10);
  const user = new User({ username, email, password: passwordHash });
  await user.save();

  res.redirect('/login');
});

router.get('/logout', (req, res) => {
  localStorage.removeItem('token');
  localStorage.removeItem('username');
  window.location.href = '/login';
});

// API-based routes for JSON token responses
router.post('/api/login', authController.login);
router.post('/api/register', authController.register);
router.post('/api/logout', authController.logout);

module.exports = router;
