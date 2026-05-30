const mongoose = require('mongoose');

const saleItemSchema = new mongoose.Schema({
    product_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    product_name: { type: String, required: true },
    quantity: { type: Number, required: true },
    sale_price: { type: Number, required: true },
    total: { type: Number, required: true }
});

const saleSchema = new mongoose.Schema({
    items: [saleItemSchema],
    subtotal: { type: Number, required: true },
    discount: { type: Number, default: 5 },
    total: { type: Number, required: true },
    payment_method: { type: String, enum: ['cash', 'card'], default: 'cash' }
}, { timestamps: true });

module.exports = mongoose.model('Sale', saleSchema);