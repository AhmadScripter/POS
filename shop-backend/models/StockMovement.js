const mongoose = require('mongoose');

const stockMovementSchema = new mongoose.Schema({
    product_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    type: { type: String, enum: ['IN', 'OUT', 'ADJUSTMENT'] },
    quantity: { type: Number },
    reason: { type: String },
    reference_id: { type: String },
}, { timestamps: true });

module.exports = stockMovementSchema;