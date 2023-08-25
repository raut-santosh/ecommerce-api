const Order = require('../models/Order');

exports.createOrder = async (req, res, next) => {
  try {
    const { user, products, totalPrice, address } = req.body;
    const order = new Order({
      user,
      products,
      totalPrice,
      address,
    });

    const savedOrder = await order.save();

    res.status(201).json({
      message: 'Order created successfully',
      order: savedOrder
    });
  } catch (error) {
    res.status(500).json({
      error: 'An error occurred while creating the order.'
    });
  }
};

exports.getAllOrders = async (req, res, next) => {
  try {
    const orders = await Order.find();

    res.status(200).json({
      orders
    });
  } catch (error) {
    res.status(500).json({
      error: 'An error occurred while fetching the orders.'
    });
  }
};

exports.getOrderById = async (req, res, next) => {
  try {
    const orderId = req.params.orderId;
    const order = await Order.findById(orderId);
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
