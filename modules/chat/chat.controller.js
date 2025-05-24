const ChatService = require('./chat.service');
const User = require('../../models/userModel');
const Messages = require('../../models/messageModel');

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

exports.getUsersWithUnreadCounts = async (req, res) => {
  const currentUserId = req.user._id;
  console.log(currentUserId);
  const users = await User.find({ _id: { $ne: currentUserId } }).lean();

  const unreadCounts = await Messages.aggregate([
    {
      $match: {
        receiver: currentUserId,
      }
    },
    {
      $group: {
        _id: "$sender",
        count: { $sum: 1 }
      }
    }
  ]);

  const unreadMap = {};
  unreadCounts.forEach(item => {
    unreadMap[item._id.toString()] = item.count;
  });

  const result = users.map(user => ({
    _id: user._id,
    username: user.username,
    unreadCount: unreadMap[user._id.toString()] || 0
  }));

  res.json(result);
};

exports.loadChatHistory = async (req, res) => {
  try {
    const currentUserId = req.user._id;
    const receiverId = req.params.receiverId;

    if (!receiverId) {
      return res.status(400).json({ message: 'Receiver ID is required' });
    }
    
    const messages = await Messages.find({
      $or: [
        { from: currentUserId, to: receiverId },
        { from: receiverId, to: currentUserId }
      ]
    }).sort({ createdAt: 1 });

    const formattedMessages = messages.map(msg => ({
      text: msg.text,
      fromSelf: msg.from.toString() === currentUserId.toString()
    }));

    res.json(formattedMessages);
  } catch (err) {
    console.log(err)
    res.status(500).json({ message: 'Failed to load chat history' });
  }
};

