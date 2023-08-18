const mongoose = require('mongoose');
const Counter = require('./Counter');

const fileSchema = new mongoose.Schema({
  idseq: { type: Number, unique: true },
  name: { type: String }, // required: true
  alias: { type: String },
  path: { type: String },
  type: { type: String },
  size: { type: Number }, // in bytes
  is_active: { type: Boolean, default: true },
}, { timestamps: true });

fileSchema.pre('save', async function (next) {
  const doc = this;
  if (!doc.idseq) {
    const nextId = await Counter.getNextSequence(doc.constructor.modelName);
    doc.idseq = nextId;
  }
  next();
});

const File = mongoose.model('File', fileSchema);

module.exports = File;
