// messages.routes.js
const express = require('express');
const router = express.Router();
const db = require('../db');

// get all users
router.route('/users').get((req, res) => {
    res.json(db.users);
});

module.exports = router;