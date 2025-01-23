const express = require('express');
const router = express.Router();
const { getUserProfil } = require('../controllers/userController');
const verifyToken = require('../middlewares/verifyToken');

//user profile
router.get('/profile', verifyToken, getUserProfil);

module.exports = router;
