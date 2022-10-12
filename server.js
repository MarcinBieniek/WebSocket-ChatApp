const express = require('express');
const path = require('path');

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

app.listen(8000, () => {
  console.log('Server is running on port: 8000');
});