const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    address: { type: String, required: true },
    price: { type: Number, required: true },
    type: { type: String, enum: ['sale', 'rent'], required: true },
    category: { type: String, enum: ['apartment', 'house', 'villa', 'land'], required: true },
    status: { type: String, enum: ['available', 'pending', 'sold'], default: 'available' },
    agent_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    images: [{ type: String }] } ,
  { timestamps: true }
);

module.exports = mongoose.model('Property', propertySchema);