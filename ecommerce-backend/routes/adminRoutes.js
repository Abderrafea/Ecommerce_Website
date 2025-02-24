const express = require('express');
const router = express.Router();
const {getAdminDashboard, getAllUsers, deleteUser} = require('../controllers/userController');
const isAdmin = require('../middlewares/isAdmin');
const verifyToken = require('../middlewares/verifyToken');

// Admin dashboard
router.get('/dashboard', verifyToken, isAdmin, getAdminDashboard);

// get all users
router.get('/users', verifyToken, isAdmin, getAllUsers);

//delete user
router.delete('/users/:id', verifyToken, isAdmin, deleteUser);

module.exports = router;