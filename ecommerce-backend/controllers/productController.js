const Product = require('../models/Product');

exports.createProduct = async (req, res) => {
  try {
    console.log('=== CRÉATION PRODUIT ===');
    console.log('Body reçu:', req.body);
    
    const { name, description, price, image, category, stock } = req.body;

    console.log('Données extraites:');
    console.log('- name:', name, 'type:', typeof name);
    console.log('- description:', description, 'type:', typeof description);
    console.log('- price:', price, 'type:', typeof price);
    console.log('- image:', image, 'type:', typeof image);
    console.log('- category:', category, 'type:', typeof category);
    console.log('- stock:', stock, 'type:', typeof stock);

    // Validation des champs requis
    if (!name || !description || !price || !category || stock === undefined || stock === '') {
      console.log('ERREUR VALIDATION: Champs manquants');
      return res.status(400).json({ 
        message: 'Tous les champs sont requis sauf l\'image' 
      });
    }

    // Validation du prix
    if (price <= 0) {
      console.log('ERREUR VALIDATION: Prix invalide');
      return res.status(400).json({ 
        message: 'Le prix doit être supérieur à 0' 
      });
    }

    // Validation du stock
    if (stock < 0) {
      console.log('ERREUR VALIDATION: Stock négatif');
      return res.status(400).json({ 
        message: 'Le stock ne peut pas être négatif' 
      });
    }

    const product = new Product({
      name: name.trim(),
      description: description.trim(),
      price: Number(price),
      image: image || '', // Image optionnelle
      category: category.trim(),
      stock: Number(stock),
    });

    console.log('Produit à sauvegarder:', product);
    await product.save();
    console.log('Produit sauvegardé avec succès');
    
    res.status(201).json({ message: 'Produit créé avec succès', product });
  } catch (err) {
    console.error('Erreur création produit:', err);
    res.status(500).json({ message: 'Erreur serveur', error: err.message});
  }
};

module.exports.getProducts = async (req, res) => {
    try {
        const products = await Product.find();

        res.json(products);        
    }catch (err){
        res.status(500).json({message: 'Server error'});
    }
};

module.exports.getProductById = async (req, res) => {
    try{
        const product = await Product.findById(req.params.id);

        if (!product) return res.status(400).json({message: 'Product not found'});

        res.json(product);

    }catch (err){
        res.status(500).json({message: 'Server error'});
    }
};

exports.updateProduct = async (req, res) => {
    try {
        const { name, description, price, image, category, stock } = req.body;

        // Validation des champs requis
        if (!name || !description || !price || !category || stock === undefined) {
            return res.status(400).json({ 
                message: 'Tous les champs sont requis sauf l\'image' 
            });
        }

        // Validation du prix
        if (price <= 0) {
            return res.status(400).json({ 
                message: 'Le prix doit être supérieur à 0' 
            });
        }

        // Validation du stock
        if (stock < 0) {
            return res.status(400).json({ 
                message: 'Le stock ne peut pas être négatif' 
            });
        }

        const updateData = {
            name: name.trim(),
            description: description.trim(),
            price: Number(price),
            image: image || '',
            category: category.trim(),
            stock: Number(stock),
        };

        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id, 
            updateData, 
            { new: true, runValidators: true }
        );
        
        if (!updatedProduct) {
            return res.status(404).json({ message: 'Produit non trouvé' });
        }
        
        res.status(200).json({ message: 'Produit mis à jour avec succès', product: updatedProduct });
    } catch (err) {
        console.error('Erreur mise à jour produit:', err);
        res.status(500).json({ message: 'Erreur serveur', error: err.message });
    }
};

exports.deleteProduct = async (req, res) => {
    try {
        const deletedProduct = await Product.findByIdAndDelete(req.params.id);
        if (!deletedProduct) return res.status.json({ message: 'Product not found'});
        res.status(201).json({ message : 'Product deleted'});
    } catch (err) {
        res.status(500).json({ message : 'Server error'});
    }
};
