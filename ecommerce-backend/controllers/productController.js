const Product = require('../models/Product');

exports.createProduct = async (req, res) => {
  try {
    const { name, description, price, image, category, stock } = req.body;

    const product = new Product({
      name,
      description,
      price,
      image,
      category,
      stock,
    });

    await product.save();
    res.status(201).json({ message: 'Product created', product });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message});
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
        const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedProduct) return res.status(400).json({ message: 'Product not found'});
        res.status(201).json({ message : 'Product updated', product : updatedProduct });
    }catch (err) {
        res.status(500).json({ message: 'Server error'});
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
