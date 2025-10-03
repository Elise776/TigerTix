const express = require('express');
const { addEvent } = require('../controllers/adminController');

//Creates a router to define routes
const router = express.Router();

//Allows the addEvent function to use POST to add events
router.post('/events', addEvent);

module.exports = router;
