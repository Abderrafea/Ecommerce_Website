const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');

module.exports.getUserProfil = (req, res) => {
    res.json({message : 'user profil', user : req.user});
};

module.exports.getAdminDashboard = async (req, res) => {
    try{
        const totalUsers = await User.countDocuments();
        const totalProducts = await Product.countDocuments();
        const totalOrders = await Order.countDocuments();

        const orders = await Order.find();
        const totalSales = await orders.reduce((sum, order) => sum + order.totalPrice, 0);

        res.json({
            admin: req.user,
            dashboard: {
                totalUsers,
                totalProducts,
                totalOrders,
                totalSales
            }
        });
    } catch (err){
        res.status(500).json({message: 'Server error'});
    }
};

module.exports.getAllUsers = async (req, res) => {
    try{
        const AllUsers = await User.find();
        res.json(AllUsers);
    } catch (err) {
        res.status(500).json({message: 'Server error'});
    }
};

exports.deleteUser = async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};