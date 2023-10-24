const mongoose = require('mongoose');
const Counter = require('./Counter');


const addressSchema = new mongoose.Schema({
    idseq: { type: Number, unique: true },
    customerName: { type: String, required: true }, // Name of the person associated with the address
    contactNo: { type: String, required: true }, // Contact phone number
    addressLine: { type: String, required: true }, // Address line 1 (e.g., House/Flat/Street)
    locality: { type: String, required: true }, // Locality/Neighborhood
    city: { type: String, required: true }, // City
    state: { type: String, required: true }, // State
    postalCode: { type: String, required: true }, // Postal code
    country: { type: String, default: 'India' }, // Country
    label: { type: String, enum: ['Home', 'Office', 'Other'], default: 'Home' },
    latitude: { type: Number },
    longitude: { type: Number },
    mapAddress: { type: String },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    isDefault: { type: Boolean, default: false }
}, {timestamps: true});

addressSchema.pre('save', async function (next) {
const doc = this;
if (!doc.idseq) {
    const nextId = await Counter.getNextSequence(doc.constructor.modelName);
    doc.idseq = nextId;
}
next();
});

const Address = mongoose.model('Address', addressSchema);

module.exports = Address;