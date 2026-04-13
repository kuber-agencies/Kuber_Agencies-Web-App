const express = require('express');
const router = express.Router();
const { getProducts, getProduct, createProduct, updateProduct, deleteProduct } = require('../controllers/productController');
const { protect } = require('../middleware/auth');
const { uploadProduct } = require('../config/cloudinary');

router.get('/', getProducts);
router.get('/:id', getProduct);
router.post('/', protect, uploadProduct.single('image'), createProduct);
router.put('/:id', protect, uploadProduct.single('image'), updateProduct);
router.delete('/:id', protect, deleteProduct);

module.exports = router;
