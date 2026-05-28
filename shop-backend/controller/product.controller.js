const Product = require('../models/Product');

const getProducts = async (req, res) => {
  try {
    const { search, category, low_stock } = req.query;
    let query = { is_active: true };

    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }
    if (category) {
      query.category = category;
    }
    if (low_stock === 'true') {
      query.$expr = { $lte: ['$quantity', '$min_stock_alert'] };
    }

    const products = await Product.find(query).sort({ name: 1 });
    res.json({ success: true, data: products });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

const addProduct = async (req, res) => {
  try {
    let result;
    if (Array.isArray(req.body)) {
      result = await Product.insertMany(req.body);
    } else {
      result = await new Product(req.body).save();
    }
    res.json({ success: true, data: result });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

const updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id, req.body, { new: true }
    );
    res.json({ success: true, data: product });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

const deleteProduct = async (req, res) => {
  try {
    await Product.findByIdAndUpdate(req.params.id, { is_active: false });
    res.json({ success: true, message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

const updateStock = async (req, res) => {
  try {
    const { quantity, type } = req.body;
    const product = await Product.findById(req.params.id);

    if (type === 'IN') {
      product.quantity += quantity;
    } else if (type === 'OUT') {
      if (product.quantity < quantity) {
        return res.status(400).json({
          success: false,
          message: 'Insufficient stock!'
        });
      }
      product.quantity -= quantity;
    }

    await product.save();
    res.json({ success: true, data: product });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

module.exports = { getProducts, addProduct, updateProduct, deleteProduct, updateStock };