const Product = require('../models/Product');

exports.createProduct = async (req, res, next) => {
    try {
      const { name, description, price, category, images, stock } = req.body;

      const product = new Product({
        name,
        description,
        price,
        images, 
        category,
        stock
      });

      const savedProduct = await product.save();

      res.status(201).json({
        message: 'Product created successfully',
        product: savedProduct
      });
    } catch (error) {
      res.status(500).json({
        error: 'An error occurred while creating the product.'
      });
    }
};

exports.getProductById = async (req, res, next) => {
  try {
    const productId = req.params.productId;
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        message: 'Product not found'
      });
    }
    res.status(200).json({
      product
    });
  } catch (error) {
    res.status(500).json({
      error: 'An error occurred while fetching the product.'
    });
  }
};

exports.updateProduct = async (req, res, next) => {
  try {
    const productId = req.params.productId;
    const { name, description, price, category, stock, images } = req.body;

    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      {
        name,
        description,
        price,
        category,
        stock,
        images
      },
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({
        message: 'Product not found'
      });
    }

    res.status(200).json({
      message: 'Product updated successfully',
      product: updatedProduct
    });
  } catch (error) {
    res.status(500).json({
      error: 'An error occurred while updating the product.'
    });
  }
};


exports.deleteProduct = async (req, res, next) => {
  try {
    const productId = req.params.productId;
    const deletedProduct = await Product.findByIdAndRemove(productId);

    if (!deletedProduct) {
      return res.status(404).json({
        message: 'Product not found'
      });
    }

    res.status(200).json({
      message: 'Product deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      error: 'An error occurred while deleting the product.'
    });
  }
};


exports.getAllProducts = async (req, res, next) => {
  try {
    const products = await Product.find();

    res.status(200).json({
      products
    });
  } catch (error) {
    res.status(500).json({
      error: 'An error occurred while fetching the products.'
    });
  }
};