const Product = require('../models/Product');

exports.addeditProduct = async (req, res, next) => {
  try {
    if(req.body._id){
      let product = await Product.findOneAndUpdate({_id:req.body._id},req.body);
      if(!product){
        return res.status(404).json({message: 'Product not found'});
      }else{
        return res.status(200).json({message:'Product updated successfully', product: product});
      }
    }else{
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
      product.save();
      if(product){
        res.status(200).json({ product: product, message:'Product added successfully' });
      }
    }
    

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
    const { offset = 0, limit = process.env.PAGINATION_LIMIT } = req.query;

    const skip = parseInt(offset) * parseInt(limit);

    const data = await Product.find().populate('images')
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const totalCount = await Product.countDocuments(); // Get the total count of documents in the collection

    res.status(200).json({ data, totalCount });
  } catch (error) {
    res.status(500).json({
      error: 'An error occurred while fetching the products.',
    });
  }
};

