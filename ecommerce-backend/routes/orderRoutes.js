const express = require('express');
const router = express.Router();
const { createOrder, getOrders, getAllOrders } = require('../controllers/orderController');
const verifyToken = require('../middlewares/verifyToken');
const isAdmin = require('../middlewares/isAdmin');

router.post('/', verifyToken, createOrder);
router.get('/orders', verifyToken, getOrders);

router.get('/', verifyToken, isAdmin, getAllOrders);

module.exports = router;