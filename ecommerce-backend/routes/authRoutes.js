const express = require('express');
const Router = express.Router();

const { registerUser, loginUser } = require('../controllers/authController');
const validateRegister = require('../middlewares/validateRegister');

Router.post('/register', validateRegister, registerUser);
Router.post('/login', loginUser);

module.exports = Router;
