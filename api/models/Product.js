const mongoose = require('mongoose');
const Counter = require('./Counter');

const productSchema = new mongoose.Schema({
  idseq: { type: Number, unique: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  images: [{ type: mongoose.Schema.Types.ObjectId, ref: 'File' }],
  category: { type: String, required: true },
  tags: [{ type: String }],
  stock: { type: Number, required: true },
  createdBy: {type: mongoose.Schema.Types.ObjectId, ref: 'User'}
}, { timestamps: true });

productSchema.pre('save', async function (next) {
  const doc = this;
  if (!doc.idseq) {
    const nextId = await Counter.getNextSequence(doc.constructor.modelName);
    doc.idseq = nextId;
  }
  next();
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
