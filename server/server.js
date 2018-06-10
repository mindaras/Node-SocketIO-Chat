require('../config/config');

const express = require('express'),
      app = express(),
      path = require('path'),
      http = require('http'),
      socketIO = require('socket.io'),
      { generateMessage, generateLocationMessage } = require('./utils/message'),
      { isRealString } = require('./utils/validation'),
      { Users } = require('./utils/users'),
      publicPath = path.join(__dirname, '../public'),
      port = process.env.PORT || 3000;

const server = http.createServer(app),
      io = socketIO(server),
      users = new Users();

app.use(express.static(publicPath));

// creates a socket
io.on('connection', socket => {
  console.log('New user connected');

  socket.on('join', (params, callback) => {
    if (!isRealString(params.displayname) || !isRealString(params.room)) {
      return callback('Display name and room name are required.');
    }

    // joins the room
    socket.join(params.room);

    // socket.leave to leave the room

    // removes user from all of the previous rooms
    users.removeUser(socket.id);

    // adds a user
    users.addUser(socket.id, params.displayname, params.room);

    // emits an event to all users in the room
    io.to(params.room).emit('updateUserList', users.getUserList(params.room));

    // emits an event
    socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat app'));

    // emits an event to all users in the room except this
    socket.broadcast.to(params.room).emit('newMessage', generateMessage('Admin', `${users.getUser(socket.id).displayName} has joined.`));

    callback();
  });

  // listens for custom event
  socket.on('createMessage', (message, callback) => {
    var user = users.getUser(socket.id);

    if (isRealString(message)) {
      // emits an event to all users
      io.to(user.room).emit('newMessage', generateMessage(user.displayName, message));
    }

    callback();
  });

  socket.on('createLocationMessage', coords => {
    var user = users.getUser(socket.id);
    io.to(user.room).emit('newLocationMessage', generateLocationMessage(user.displayName, coords.latitude, coords.longitude));
  });

  // listens for event
  socket.on('disconnect', () => {
    var user = users.removeUser(socket.id);

    io.to(user.room).emit('updateUserList', users.getUserList(user.room));
    io.to(user.room).emit('newMessage', generateMessage('Admin', `${user.displayName} has left.`));
  });
});

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
