const express = require('express');
const path = require('path');
const socket = require('socket.io');
const db = require('./db.js');

const app = express();

//middleware
app.use(express.urlencoded ({ extended:false }));
app.use(express.json());
app.use(express.static(path.join(__dirname, '/client')));

// import routes
const messagesRoutes = require('./routes/messages.routes.js');

// initial routes
app.use('/api/', messagesRoutes);

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
  socket.on('message', (message) => {
    console.log('Oh, I\'ve got something from ' + socket.id);
    db.messages.push(message);
    socket.broadcast.emit('message', message);
  });
  
  socket.on('disconnect', () => { console.log('Oh, socket ' + socket.id + ' has left') });
  console.log('I\'ve added a listener on message and disconnect events \n');
});



