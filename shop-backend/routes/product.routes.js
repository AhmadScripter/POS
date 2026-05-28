const express = require('express');
const router = express.Router();
const { getProducts, addProduct, updateProduct, deleteProduct, updateStock } = require('../controller/product.controller');

router.get('/', getProducts);
router.post('/', addProduct);
router.put('/:id', updateProduct);
router.delete('/:id',deleteProduct);
router.patch('/:id/stock',updateStock);

module.exports = router;