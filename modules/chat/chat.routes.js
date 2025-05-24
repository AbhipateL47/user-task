const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const ChatController = require('./chat.controller');

router.get('/chat', ChatController.renderChatPage);
router.post('/messages/mark-read', ChatController.markMessagesAsRead);
router.get('/:userId', authMiddleware, async (req, res) => {
  console.log("s",req.userId, req.params.userId);
  const messages = await ChatService.getMessagesBetween(req.userId, req.params.userId);
  const formatted = messages.map(msg => ({
    text: msg.text,
    fromSelf: msg.sender.toString() === req.user._id.toString()
  }));
  res.json(formatted);
});

module.exports = router;



// const express = require('express');
// const router = express.Router();
// const User = require('../../models/userModel');
// const authMiddleware = require('../middlewares/authMiddleware');

// router.get('/chat', async (req, res) => {
//   try {
//     const loggedInUserId = req.userId;

//     const users = await User.find({ _id: { $ne: loggedInUserId } }).select('_id username').lean();

//     const selectedUserId = req.query.user;
//     let selectedUser = null;

//     if (selectedUserId) {
//       selectedUser = await User.findById(selectedUserId).select('_id username').lean();
//     }

//     res.render('chat', {
//       title: 'Chat',
//       users,
//       selectedUser,
//     });
//   } catch (err) {
//     console.error(err);
//     res.status(500).send('Server error');
//   }
// });

// router.get('/users/chat', async (req, res) => {
//   try {
//     const loggedInUser = req.userId; // set by authMiddleware
//     const userId = req.query.user;

//     const users = await User.find({ _id: { $ne: loggedInUser } }).select('_id username').lean();
//     const selectedUser = userId && userId !== loggedInUser
//       ? await User.findById(userId).select('_id username').lean()
//       : null;

//     res.render('chat', {
//       title: 'Chat',
//       users,
//       selectedUser,
//     });
//   } catch (err) {
//     console.error(err);
//     res.status(500).send('Server error');
//   }
// });

// router.post('/messages/mark-read', async (req, res) => {
//   const currentUserId = req.user.id; // or from your auth middleware
//   const fromUserId = req.body.fromUserId;

//   await Message.updateMany(
//     { from: fromUserId, to: currentUserId, read: false },
//     { $set: { read: true } }
//   );

//   res.json({ success: true });
// });


// module.exports = router;
