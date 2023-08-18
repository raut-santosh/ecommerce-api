const mongoose = require('mongoose');
const Counter = require('./Counter');

const productSchema = new mongoose.Schema({
  idseq: { type: Number, unique: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: mongoose.Schema.Types.ObjectId, ref: 'File' }, // Main profile image
  category: { type: String, required: true },
  stock: { type: Number, required: true },
  otherImages: [{ type: mongoose.Schema.Types.ObjectId, ref: 'File' }], // Array of other image IDs
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
