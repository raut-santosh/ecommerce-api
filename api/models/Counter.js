const mongoose = require('mongoose');

const counterSchema = new mongoose.Schema({
  model: { type: String, required: true },
  sequence: { type: Number, default: 0 }
}, { timestamps: true });

counterSchema.statics.getNextSequence = async function(modelName) {
  const counter = await this.findOneAndUpdate(
    { model: modelName },
    { $inc: { sequence: 1 } },
    { new: true, upsert: true }
  );
  return counter.sequence;
};

module.exports = mongoose.model('Counter', counterSchema);

