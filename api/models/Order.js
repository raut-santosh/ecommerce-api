const mongoose = require('mongoose');
const Counter = require('./Counter');

const orderSchema = new mongoose.Schema({
  idseq: { type: Number, unique: true },
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  products: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
      quantity: { type: Number, required: true, min: 1 },
    },
  ],
  totalPrice: { type: Number, required: true, min: 0 },
  address: { type: mongoose.Schema.Types.ObjectId, ref: 'Address' }, 
  totalQuantity: { type: Number, required: true, min:1},
  deliveryDate: { type: mongoose.Schema.Types.Date},
  isPaid: {type: Boolean, default: false},
  createdBy: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  status: {
    type: String,
    enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
    default: 'pending',
  },
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

