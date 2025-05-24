const mongoose = require('mongoose');
const User = require('../../models/userModel');
const Chat = require('./chat.entity');

const { Types } = mongoose;

exports.getUsersWithUnreadCount = async (currentUserId) => {
  const users = await User.find({ _id: { $ne: currentUserId } }).lean();
  const userIds = users.map(u => new Types.ObjectId(u._id));

  const unreadCounts = await Chat.aggregate([
    {
      $match: {
        to: new Types.ObjectId(currentUserId),
        from: { $in: userIds },
        read: false
      }
    },
    {
      $group: {
        _id: '$from',
        count: { $sum: 1 }
      }
    }
  ]);

  const unreadMap = {};
  unreadCounts.forEach(u => {
    unreadMap[u._id.toString()] = u.count;
  });

  users.forEach(u => {
    u.unreadCount = unreadMap[u._id.toString()] || 0;
  });

  return users;
};

exports.markMessagesAsRead = async (fromUserId, toUserId) => {
  await Chat.updateMany(
    {
      from: fromUserId,
      to: toUserId,
      read: false
    },
    {
      $set: { read: true }
    }
  );
};
