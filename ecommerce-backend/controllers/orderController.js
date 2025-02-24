const Order = require('../models/Order');
const Product = require('../models/Product');

module.exports.createOrder = async (req, res) => {
  try {
    const { products, shippingAddress } = req.body;

    if (!products || !Array.isArray(products) || products.length === 0) {
      return res.status(400).json({ message: 'Aucun produit fourni' });
    }

    if (!shippingAddress || !shippingAddress.address || !shippingAddress.city || !shippingAddress.postalCode || !shippingAddress.country) {
      return res.status(400).json({ message: 'Adresse de livraison incomplète' });
    }

    let totalPrice = 0;

    const validatedProducts = await Promise.all(products.map(async (item) => {
      if (!item.product) {
        throw new Error('ID du produit manquant');
      }

      const product = await Product.findById(item.product);

      if (!product) {
        throw new Error(`Produit non trouvé: ${item.product}`);
      }

      const quantity = item.quantity || 1;

      if (quantity <= 0) {
        throw new Error(`Quantité invalide pour le produit: ${product.name}`);
      }

      if (quantity > product.stock) {
        throw new Error(`Stock insuffisant pour le produit: ${product.name}. Demandé: ${quantity}, En stock: ${product.stock}`);
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

    const populatedOrder = await Order.findById(newOrder._id)
      .populate('user', 'name email phone')
      .populate('products.product', 'name price image');

    res.status(201).json({
      message: 'Commande créée avec succès',
      order: populatedOrder
    });

  } catch (err) {
    console.error('Erreur lors de la création de commande:', err);
    res.status(400).json({ message: err.message || 'Erreur serveur' });
  }
};

module.exports.getOrders = async (req, res) => {
  try {
    console.log('Récupération des commandes utilisateur:', req.user.id);
    const orders = await Order.find({ user: req.user.id })
      .populate('user', 'name email phone')
      .populate('products.product', 'name price image')
      .sort({ createdAt: -1 });
    console.log('Commandes trouvées:', orders.length);
    res.json(orders);
  } catch (err) {
    console.error('Erreur getOrders:', err);
    res.status(500).json({ message: 'Server error'});
  }
};

module.exports.getAllOrders = async (req, res) => {
  try {
    console.log('Récupération de toutes les commandes par admin:', req.user.id);
    
    // Vérifier s'il y a des commandes
    const count = await Order.countDocuments();
    console.log('Nombre total de commandes:', count);

    const orders = await Order.find()
      .populate('user', 'name email phone')
      .populate('products.product', 'name price image')
      .sort({ createdAt: -1 });

    console.log('Commandes récupérées:', orders.length);
    
    // Log quelques détails pour debug
    orders.forEach((order, index) => {
      console.log(`Commande ${index + 1}:`, {
        id: order._id,
        userId: order.user?._id,
        userName: order.user?.name,
        productsCount: order.products?.length,
        totalPrice: order.totalPrice
      });
    });

    res.json(orders);
  } catch (err) {
    console.error('Erreur getAllOrders:', err);
    res.status(500).json({ message: 'Server error'});
  }
};

module.exports.getOrderById = async (req, res) => {
  try {
    const { orderId } = req.params;
    
    const order = await Order.findById(orderId)
      .populate('user', 'name email phone')
      .populate('products.product', 'name price image');

    if (!order) {
      return res.status(404).json({ message: 'Commande non trouvée' });
    }

    // Vérifier que l'utilisateur peut voir cette commande (soit admin, soit propriétaire)
    if (req.user.role !== 'admin' && order.user._id.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Accès non autorisé' });
    }

    res.json(order);
  } catch (err) {
    console.error('Erreur getOrderById:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports.updateDeliveryStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { isDelivered } = req.body;

    if (typeof isDelivered !== 'boolean') {
      return res.status(400).json({ message: 'Le statut de livraison doit être un booléen' });
    }

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: 'Commande non trouvée' });
    }

    // Seul un admin peut modifier le statut de livraison
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Accès non autorisé' });
    }

    const updateData = { isDelivered };
    
    // Si la commande est marquée comme livrée, ajouter la date de livraison
    if (isDelivered && !order.isDelivered) {
      updateData.deliveredAt = new Date();
    }
    
    // Si la commande est marquée comme non livrée, supprimer la date de livraison
    if (!isDelivered) {
      updateData.deliveredAt = null;
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      updateData,
      { new: true }
    ).populate('user', 'name email phone')
     .populate('products.product', 'name price image');

    res.json({
      message: `Commande ${isDelivered ? 'marquée comme livrée' : 'marquée comme non livrée'}`,
      order: updatedOrder
    });

  } catch (err) {
    console.error('Erreur updateDeliveryStatus:', err);
    res.status(500).json({ message: 'Server error' });
  }
};