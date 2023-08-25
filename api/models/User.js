const mongoose = require('mongoose');
const Counter = require('./Counter');

const userSchema = new mongoose.Schema({
  idseq: { type: Number, unique: true },
  name: { type: String, required: true},
  email: { type: String, required: true, unique: true },
  mobile: { type: Number, required: true, unique: true},
  password: { type: String, required: true },
  role: { type: mongoose.Schema.Types.ObjectId, ref: 'Role', required: true },
  wishlist: { type: mongoose.Schema.Types.ObjectId, ref: 'Wishlist', required: false }, // Use Wishlist model
  addresses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Address', required: false}] // Use Address model
}, { timestamps: true });

userSchema.pre('save', async function (next) {
  const doc = this;
  if (!doc.idseq) {
    const nextId = await Counter.getNextSequence(doc.constructor.modelName);
    doc.idseq = nextId;
  }
  next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;

