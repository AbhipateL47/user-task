const socketio = require('socket.io');
const jwt = require('jsonwebtoken');
const Message = require('../models/messageModel');

const SECRET = 'qwerty@9876543210';

function getRoomId(userId1, userId2) {
  return [userId1, userId2].sort().join('_');
}

module.exports = (io) => {
  io.use((socket, next) => {
    const token = socket.handshake.auth?.token;
    if (!token) {
      return next(new Error('No token provided'));
    }

    jwt.verify(token, SECRET, (err, decoded) => {
      if (err) {
        return next(new Error('Token verification failed'));
      }
      socket.userId = decoded.id || decoded.userId;
      next();
    });
  });

  io.on('connection', (socket) => {
    const userId = socket.userId;
    // console.log('New socket connection, userId:', userId);
    if (!userId) {
      console.log('No userId found after token verification. Disconnecting socket.');
      return socket.disconnect(true);
    }

    socket.on('joinRoom', (otherUserId) => {
      if (!otherUserId) return;
      const roomId = getRoomId(userId, otherUserId);
      // console.log(`User ${userId} joining room ${roomId}`);
      socket.join(roomId);
    });

    socket.on('chatMessage', async ({ toUserId, text }) => {
      if (!toUserId || !text) return;

      const message = new Message({
        from: userId,
        to: toUserId,
        text,
        createdAt: new Date(),
      });

      await message.save();

      const roomId = getRoomId(userId, toUserId);
      io.to(roomId).emit('message', {
        from: userId,
        text,
        createdAt: message.createdAt,
      });
    });
  });
};
