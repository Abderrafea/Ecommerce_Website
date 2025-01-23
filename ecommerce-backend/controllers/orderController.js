const Order = require('../models/Order');
const Product = require('../models/Product');

module.exports.createOrder = async (req, res) => {
  try {
    const { products, shippingAddress } = req.body;

    if (!products || !Array.isArray(products) || products.length === 0) {
      return res.status(400).json({ message: 'No products provided' });
    }

    let totalPrice = 0;

    const validatedProducts = await Promise.all(products.map(async (item) => {
      const product = await Product.findById(item.product);

      if (!product) {
        throw new Error(`Product not found: ${item.product}`);
      }

      const quantity = item.quantity || 1;

      if (quantity > product.countInStock) {
        throw new Error(`Insufficient stock for product: ${product.name}. Requested: ${quantity}, In stock: ${product.countInStock}`);
      }

      totalPrice += product.price * quantity;

      return {
        product: product._id,
        quantity
      };
    }));

    const newOrder = await Order.create({
      user: req.user.id,
      products: validatedProducts,
      shippingAddress,
      totalPrice
    });

    res.status(201).json({
      message: 'Order created successfully',
      order: newOrder
    });

  } catch (err) {
    console.error(err);
    res.status(400).json({ message: err.message || 'Server error' });
  }
};


module.exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Server error'});
  }
};

module.exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Server error'});
  }
};

