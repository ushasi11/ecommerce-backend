const express = require('express');
const router = express.Router();
const {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
} = require('../controllers/productController');
const { protect, adminOnly } = require('../middleware/auth');
const { validateProduct } = require('../middleware/validation');

router.get('/', getProducts);
router.get('/:id', getProductById);
router.post('/', protect, adminOnly, validateProduct, createProduct);
router.put('/:id', protect, adminOnly, updateProduct);
router.delete('/:id', protect, adminOnly, deleteProduct);

module.exports = router;