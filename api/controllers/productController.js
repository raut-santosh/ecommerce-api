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
        stock,
        createdBy: req.currentUser.userId
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
    const product = await Product.findById(productId).populate('createdBy').populate('images');
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
    console.log('products',req.query)
    const { offset = 0, limit = process.env.PAGINATION_LIMIT, search } = req.query;
    const skip = parseInt(offset) * parseInt(limit);

    // Create a filter to support searching
    const filter = {};
    if (search) {
      if(search !== 'undefined'){
        filter.$or = [
          { name: { $regex: search, $options: 'i' } }, // Case-insensitive search on the 'name' field
          // { description: { $regex: search, $options: 'i' } }, // Case-insensitive search on the 'description' field
          { category: { $regex: search, $options: 'i' } }
        ];
      }
    }

    // Query the products collection with search and pagination
    const data = await Product.find(filter)
      .populate('images')
      .populate('createdBy')
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    // Get the total count of documents that match the search criteria
    const totalCount = await Product.countDocuments(filter);

    res.status(200).json({ data, totalCount });
  } catch (error) {
    res.status(500).json({
      error: 'An error occurred while fetching the products.',
    });
  }
};


