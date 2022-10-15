const express = require('express');
const path = require('path');
const socket = require('socket.io');
const db = require('./db.js');

const app = express();
let users = [];

//middleware
app.use(express.urlencoded ({ extended:false }));
app.use(express.json());
app.use(express.static(path.join(__dirname, '/client')));

// import routes
const messagesRoutes = require('./routes/messages.routes.js');
const usersRoutes = require('./routes/users.routes.js');

// initial routes
app.use('/api/', messagesRoutes);
app.use('/api/', usersRoutes);

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '/client/index.html'));
});

app.use((req, res) => {
    res.status(404).send('404 not found...');
});

const server = app.listen(8000, () => {
  console.log('Server is running on port: 8000');
});

const io = socket(server);

io.on('connection', (socket) => {
  console.log('New client! Its id – ' + socket.id);
  
  socket.on('join', (userName) => {
    users.push({ name: userName, id: socket.id });
    socket.broadcast.emit('message', {
      author: 'Chatbot',
      content: `<i>${userName} has joined the conversation!`,
    });
  })

  socket.on('message', (message) => {
    console.log('Oh, I\'ve got something from ' + socket.id);
    db.messages.push(message);
    socket.broadcast.emit('message', message);
  });
  
  socket.on('disconnect', () => { 
    if (users.length > 0) {
      userName = users.filter((user) => user.id === socket.id)[0].name;
      users = users.filter((user) => user.id !== socket.id);
      socket.broadcast.emit('message', {
        author: 'Chatbot',
        content: `<i>${userName} has left the conversation...`,
      });
    }
   });
  console.log('I\'ve added a listener on message and disconnect events \n');
});



