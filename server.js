require('dotenv').config();
const express = require('express');
const session = require('express-session');
const path = require('path');
const http = require('http');
const connectDB = require('./config/dbConnection');
const authRoutes = require('./modules/auth/auth.routes');
const expressLayouts = require('express-ejs-layouts');
const chatRoutes = require('./modules/chat/chat.routes');

connectDB();

const app = express();

app.use(expressLayouts);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.set('layout', 'layout');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const sessionMiddleware = session({
  secret: process.env.JWT_SECRET || 'secret123',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false,
    httpOnly: true,
    sameSite: 'lax',
  }
});

app.use(sessionMiddleware);

app.use(express.static(path.join(__dirname, 'public')));

app.use('/auth', authRoutes);
app.use('/', chatRoutes);

app.use((req, res) => {
  res.status(404).send('Page not found');
});

const server = http.createServer(app);

const io = require('socket.io')(server, {
  cors: {
    origin: '*',
    credentials: true
  }
});

io.use((socket, next) => {
  sessionMiddleware(socket.request, {}, next);
});

require('./socket/socket')(io);

const PORT = process.env.PORT || 5003;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});