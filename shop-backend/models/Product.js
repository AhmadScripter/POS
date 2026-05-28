const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    generic_name: { type: String },      
    category: { type: String },          
    barcode: { type: String, unique: true, sparse: true },

    purchase_price: { type: Number, required: true },
    sale_price: { type: Number, required: true },

    quantity: { type: Number, default: 0 },
    min_stock_alert: { type: Number, default: 10 },
    unit: { type: String, default: 'pieces' },     

    expiry_date: { type: Date },
    batch_number: { type: String },
    manufacturer: { type: String },
    requires_prescription: { type: Boolean, default: false },

    is_active: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);