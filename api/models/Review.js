const mongoose = require('mongoose');
const Counter = require('./Counter');

const reviewSchema = new mongoose.Schema({
  idseq: { type: Number, unique: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  rating: { type: Number, min: 1, max: 5, required: true },
  comment: { type: String },
}, { timestamps: true });

reviewSchema.pre('save', async function (next) {
  const doc = this;
  if (!doc.idseq) {
    const nextId = await Counter.getNextSequence(doc.constructor.modelName);
    doc.idseq = nextId;
  }
  next();
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;

