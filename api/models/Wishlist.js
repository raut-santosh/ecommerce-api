const mongoose = require('mongoose');
const Counter = require('./Counter');


const wishlistSchema = new mongoose.Schema({
  idseq: {required: true, unique: true},
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Reference to the User who owns the wishlist
  products: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }] // References to the Products in the wishlist
}, {timestamps: true});


wishlistSchema.pre('save', async function (next) {
const doc = this;
if (!doc.idseq) {
    const nextId = await Counter.getNextSequence(doc.constructor.modelName);
    doc.idseq = nextId;
}
next();
});
const Wishlist = mongoose.model('Wishlist', wishlistSchema);
module.exports = Wishlist;