const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');
const bcrypt = require('bcryptjs');

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

module.exports.updateUserProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, email, password, currentPassword } = req.body;
    if (!currentPassword) {
      return res.status(400).json({ message: 'Mot de passe actuel requis' });
    }
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Mot de passe actuel incorrect' });
    }
    const updateFields = {};
    if (name) updateFields.name = name;
    if (email) updateFields.email = email;
    if (password) updateFields.password = await bcrypt.hash(password, 10);

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updateFields },
      { new: true, runValidators: true }
    ).select('-password');

    res.json({ message: 'Profil mis à jour', user: updatedUser });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur' });
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