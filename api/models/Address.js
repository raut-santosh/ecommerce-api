const mongoose = require('mongoose');
const Counter = require('./Counter');


const addressSchema = new mongoose.Schema({
    idseq: { type: Number, unique: true },
    name: { type: String, required: true }, // Name of the person associated with the address
    phone: { type: String, required: true }, // Contact phone number
    line1: { type: String, required: true }, // Address line 1 (e.g., House/Flat/Street)
    line2: { type: String }, // Address line 2 (e.g., Landmark)
    locality: { type: String, required: true }, // Locality/Neighborhood
    city: { type: String, required: true }, // City
    state: { type: String, required: true }, // State
    pincode: { type: String, required: true }, // Postal code
    country: { type: String, default: 'India' }, // Country
    label: { type: String, enum: ['Home', 'Office', 'Other'], default: 'Home' },
    latitude: { type: Number },
    longitude: { type: Number },
    mapAddress: { type: String },
    isDefault: { type: Boolean, default: false } // is this default address
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