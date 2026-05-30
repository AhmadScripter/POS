const Sale = require('../models/Sale');
const Product = require('../models/Product');

const getSales = async (req, res) => {
    try {
        const sales = await Sale.find().sort({ createdAt: -1 });
        res.json({ success: true, data: sales });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

const getSale = async (req, res) => {
    try {
        const sale = await Sale.findById(req.params.id);
        res.status(200).json({ sucess: true, data: sale });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
}

const createSale = async (req, res) => {
    try {
        const { items, subtotal, discount, total, payment_method } = req.body;

        for (const item of items) {
            const product = await Product.findById(item.product_id);
            if (!product) {
                return res.status(404).json({ success: false, message: `Product not found: ${item.product_name}` });
            }
            if (product.quantity < item.quantity) {
                return res.status(400).json({ success: false, message: `Insufficient stock for: ${item.product_name}` });
            }
            product.quantity -= item.quantity;
            await product.save();
        }

        const sale = new Sale({ items, subtotal, discount, total, payment_method });
        await sale.save();

        res.json({ success: true, data: sale });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
}

module.exports = { getSales, createSale, getSale };