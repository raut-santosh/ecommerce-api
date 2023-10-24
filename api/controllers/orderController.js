const Order = require('../models/Order');
const Product = require('../models/Product');

exports.createOrder = async (req, res, next) => {
  try {
    const { customer, products, address } = req.body;
    let totalPrice = 0;

    // Fetch all product prices concurrently
    const productPromises = products.map(async (productObj) => {
      const product = await Product.findOne({ _id: productObj.product });
      if (product) {
        return product.price * productObj.quantity;
      }
      return 0; // Return 0 if the product is not found
    });

    const productPrices = await Promise.all(productPromises);

    // Calculate the total price
    totalPrice = productPrices.reduce((acc, price) => acc + price, 0);
    let totalQuantity=0;
    products.forEach((product) => {
      console.log(product);
      totalQuantity += product.quantity;
    })

    const order = new Order({
      customer,
      products,
      totalPrice,
      address,
      totalQuantity,
      createdBy: req.currentUser.userId
    });

    const savedOrder = await order.save();

    res.status(201).json({
      message: 'Order created successfully',
      order: savedOrder,
    });
  } catch (error) {
    res.status(500).json({
      error: 'An error occurred while creating the order.',
    });
  }
};


exports.getAllOrders = async (req, res, next) => {
  try {
    const { offset = 0, limit = process.env.PAGINATION_LIMIT } = req.query;
    const skip = parseInt(offset) * parseInt(limit);
    let conditionarray = [{}];
    if (req.query.searchbyrole !== 'null' && req.query.searchbyrole !== undefined) {
      const roleId = req.query.searchbyrole;
      conditionarray.push({ role: roleId });
    }
    
    
    const query = { $and: conditionarray };
    const list = await Order.find(query).populate('customer').populate('address').populate('products.product').skip(skip).limit(parseInt(limit)).sort({ createdAt: -1 });
    const totalCount = await Order.countDocuments(query);

    if (list.length === 0) { 
      return res.status(200).json({ message: 'No orders found' });
    }

    res.status(200).json({
      list,
      totalCount,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: 'An error occurred while fetching the orders.',
    });
  }
};

exports.getOrderById = async (req, res, next) => {
  try {
    const orderId = req.params.orderId;
    const order = await Order.findById(orderId).populate('address');
    if (!order) {
      return res.status(404).json({
        message: 'Order not found'
      });
    }
    res.status(200).json({
      order
    });
  } catch (error) {
    res.status(500).json({
      error: 'An error occurred while fetching the order.'
    });
  }
};

exports.updateOrderStatus = async (req, res, next) => {
  try {
    const orderId = req.params.orderId;
    const { status } = req.body;

    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({
        message: 'Order not found'
      });
    }

    res.status(200).json({
      message: 'Order status updated successfully',
      order: updatedOrder
    });
  } catch (error) {
    res.status(500).json({
      error: 'An error occurred while updating the order status.'
    });
  }
};

exports.deleteOrder = async (req, res, next) => {
  try {
    const orderId = req.params.orderId;
    const deletedOrder = await Order.findByIdAndRemove(orderId);

    if (!deletedOrder) {
      return res.status(404).json({
        message: 'Order not found'
      });
    }

    res.status(200).json({
      message: 'Order deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      error: 'An error occurred while deleting the order.'
    });
  }
};
