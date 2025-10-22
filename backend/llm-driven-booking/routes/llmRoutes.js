import express from 'express';
import { parseText, confirmBooking } from '../controllers/llmController.js';
const router = express.Router();

router.post('/parse', parseText); 
router.post('/confirm', confirmBooking);

module.exports = router;
