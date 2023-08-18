const Product = require('../models/Product');

// Controller to get a list of all products
exports.getAllProducts = async (req, res, next) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while fetching products.' });
  }
};

// Controller to create a new product
exports.createProduct = async (req, res, next) => {
  try {
    const { name, description, price, imageUrl, category, stock } = req.body;
    const product = new Product({
      name,
      description,
      price,
      imageUrl,
      category,
      stock,
    });
    const savedProduct = await product.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while creating the product.' });
  }
};

// Controller to get a single product by ID
exports.getProductById = async (req, res, next) => {
  try {
    const productId = req.params.productId;
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ error: 'Product not found.' });
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while fetching the product.' });
  }
};

// Controller to update a product by ID
exports.updateProductById = async (req, res, next) => {
  try {
    const productId = req.params.productId;
    const updatedData = req.body;
    const updatedProduct = await Product.findByIdAndUpdate(productId, updatedData, {
      new: true,
    });
    if (!updatedProduct) {
      return res.status(404).json({ error: 'Product not found.' });
    }
    res.status(200).json(updatedProduct);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while updating the product.' });
  }
};

// Controller to delete a product by ID
exports.deleteProductById = async (req, res, next) => {
  try {
    const productId = req.params.productId;
    const deletedProduct = await Product.findByIdAndDelete(productId);
    if (!deletedProduct) {
      return res.status(404).json({ error: 'Product not found.' });
    }
    res.status(204).json();
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while deleting the product.' });
  }
};
