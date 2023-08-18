const mongoose = require('mongoose');
const Counter = require('./Counter');

const orderSchema = new mongoose.Schema({
  idseq: { type: Number, unique: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  products: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
      quantity: { type: Number, required: true },
      price: { type: Number, required: true },
    }
  ],
  totalAmount: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'completed', 'cancelled'], default: 'pending' },
}, { timestamps: true });

orderSchema.pre('save', async function (next) {
  const doc = this;
  if (!doc.idseq) {
    const nextId = await Counter.getNextSequence(doc.constructor.modelName);
    doc.idseq = nextId;
  }
  next();
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;

