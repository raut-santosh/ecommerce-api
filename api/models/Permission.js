const mongoose = require('mongoose');
const Counter = require('./Counter');

const permissionSchema = new mongoose.Schema({
  idseq: { type: Number, unique: true },
  name: { type: String, required: true, unique: true },
  alias: { type: String, required: true, unique: true, index: { unique: true, sparse: true } },
  category: { type: String, lowercase: true },
  description: { type: String },
  scope: { type: String, default: 'tenant' },
}, {timestamps: true});

permissionSchema.pre('save', async function (next) {
const doc = this;
if (!doc.idseq) {
    const nextId = await Counter.getNextSequence(doc.constructor.modelName);
    doc.idseq = nextId;
}
next();
});

const Permission = mongoose.model('Permission', permissionSchema);

module.exports = Permission;
  