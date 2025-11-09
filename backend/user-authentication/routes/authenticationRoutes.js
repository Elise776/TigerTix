const express = require('express');
//Creates a router
const router = express.Router();
//Imports functions to handle register, login, and logout from authenticationController.js
const { register, login, logout } = require('../controllers/authenticationController');
//Imports verifyToken from authenticationMiddleware.js
const verifyToken = require('../middleware/authenticationMiddleware');

//Handles registration of new users using the registerUser api
router.post('/register', register);

//Handles login of users using the userLogin api
router.post('/login', login);

//Handles the logout of users using the userLogout api
router.post('/logout', logout);

//Handles the verification of tokens using the accessProtectedRoutes api
router.get('/protected', verifyToken, (request, response) => {response.json({ message: `Welcome ${request.user.email}!` });});

module.exports = router;
