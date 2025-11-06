const express = require('express');
const router = express.Router();
const { register, login, logout } = require('../controllers/authenticationController');
const verifyToken = require('../middleware/authenticationMiddleware');

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.get('/protected', verifyToken, (req, res) => {res.json({ message: `Welcome ${req.user.email}!` });});

module.exports = router;
