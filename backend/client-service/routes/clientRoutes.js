const express = require('express');
const clientController = require('../controllers/clientController');

//Creates router
const router = express.Router();

//Gets all events for GET API request for events
router.get('/events', clientController.listEvents);

//Modifies the ticket value for POST API request for tickets
router.post('/events/:id/purchase', clientController.buyTicket);

//Exports router for use in other files
module.exports = router;