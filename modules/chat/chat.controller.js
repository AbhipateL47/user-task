const ChatService = require('./chat.service');
const User = require('../../models/userModel');

exports.renderChatPage = async (req, res) => {
  try {
    const loggedInUserId = req.userId;
    const selectedUserId = req.query.user;

    const users = await ChatService.getUsersWithUnreadCount(loggedInUserId);

    let selectedUser = null;
    if (selectedUserId) {
      selectedUser = await User.findById(selectedUserId).select('_id username').lean();
    }

    res.render('chat', {
      title: 'Chat',
      users,
      selectedUser,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

exports.markMessagesAsRead = async (req, res) => {
  try {
    const currentUserId = req.userId;
    const fromUserId = req.body.fromUserId;

    await ChatService.markMessagesAsRead(fromUserId, currentUserId);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error marking messages as read');
  }
};
