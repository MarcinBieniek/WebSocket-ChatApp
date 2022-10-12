// messages.routes.js
const express = require('express');
const router = express.Router();
const db = require('../db');

// get all messages
router.route('/messages').get((req, res) => {
    res.json(db.messages);
});

module.exports = router;