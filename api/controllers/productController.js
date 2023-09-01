const Product = require('../models/Product');

exports.createProduct = async (req, res, next) => {
  try {
    const { name, description, price, category, images, tags, stock } = req.body;
    const product = new Product({
      name,
      description,
      price,
      images,
      category,
      tags,
      stock
    });
    console.log(product);
    
    product.save().then((savedProduct) => { // Save the product and use the saved product in the callback
      console.log('Creating Product');
      res.status(201).json({
        message: 'Product created successfully',
        product: savedProduct
      });
    }).catch((error) => {
      res.status(500).json({
        error
      });
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
        images, 
        category,
        tags,
        stock
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
    console.log('delete Product')
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
    const page = parseInt(req.query.page) || 1; // Parse the page parameter or default to 1
    const limit = parseInt(req.query.limit) || 10; // Parse the limit parameter or default to 10

    const skip = (page - 1) * limit; // Calculate the number of records to skip

    const [products, totalCount] = await Promise.all([
      Product.find().skip(skip).limit(limit).exec(),
      Product.countDocuments().exec() // Count all documents to get the total count
    ]);

    res.status(200).json({
      products,
      totalCount
    });
  } catch (error) {
    res.status(500).json({
      error: 'An error occurred while fetching the products.'
    });
  }
};
