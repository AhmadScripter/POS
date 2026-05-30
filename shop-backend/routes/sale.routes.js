const express = require('express');
const router = express.Router();
const { getSales, createSale, getSale } = require('../controller/sale.controller');

router.get('/', getSales);
router.get('/:id', getSale);
router.post('/', createSale);

module.exports = router;