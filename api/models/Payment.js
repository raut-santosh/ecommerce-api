const mongoose = require('mongoose');
const Counter = require('./Counter');

const paymentSchema = new mongoose.Schema({
  orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' }, // Reference to the order
  method: { type: String, required: true }, // Payment method (e.g., Credit Card, PayPal)
  transactionId: { type: String, required: true }, // Payment transaction ID
  time: { type: Date, required: true }, // Timestamp of payment
  isPaid: { type: Boolean, default: false },
},{timestamp: true});

const Payment = mongoose.model('Payment', paymentSchema);

module.exports = Payment;
