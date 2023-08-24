const mongoose = require('mongoose');
const Counter = require('./Counter');

const paymentSchema = new mongoose.Schema({
  idseq: { type: Number, unique: true },
  orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' }, // Reference to the order
  method: { type: String, required: true }, // Payment method (e.g., Credit Card, PayPal)
  transactionId: { type: String, required: true }, // Payment transaction ID
  time: { type: Date, required: true }, // Timestamp of payment
  isPaid: { type: Boolean, default: false },
},{timestamp: true});

paymentSchema.pre('save', async function (next) {
  const doc = this;
  if (!doc.idseq) {
    const nextId = await Counter.getNextSequence(doc.constructor.modelName);
    doc.idseq = nextId;
  }
  next();
});

const Payment = mongoose.model('Payment', paymentSchema);

module.exports = Payment;
