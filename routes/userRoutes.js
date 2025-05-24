const express = require('express');
const router = express.Router();
const User = require('../models/userModel');
const Message = require('../models/messageModel');

function isAuthenticated(req, res, next) {
  if (req.session.userId) return next();
  res.redirect('/auth/login');
}

router.get('/chat', isAuthenticated, async (req, res) => {
  const users = await User.find({ _id: { $ne: req.session.userId } });
  const selectedUserId = req.query.user;
  let selectedUser = null;
  let messages = [];

  if (selectedUserId) {
    selectedUser = await User.findById(selectedUserId);
    messages = await Message.find({
      $or: [
        { from: req.session.userId, to: selectedUserId },
        { from: selectedUserId, to: req.session.userId },
      ],
    }).sort('createdAt');
  }

  res.render('chat', { users, selectedUser, messages });
});

module.exports = router;
