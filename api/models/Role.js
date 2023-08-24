const mongoose = require('mongoose');
const Counter = require('./Counter');

const roleSchema = new mongoose.Schema({
    idseq: { type: Number, unique: true },
    name: { type: String, required: true, unique: true },
    permissions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Permission' }] // References to permission documents
}, {timestamps: true});

roleSchema.pre('save', async function (next) {
const doc = this;
if (!doc.idseq) {
    const nextId = await Counter.getNextSequence(doc.constructor.modelName);
    doc.idseq = nextId;
}
next();
});

const Role = mongoose.model('Role', roleSchema);

module.exports = Role;