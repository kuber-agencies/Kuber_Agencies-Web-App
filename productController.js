const Product = require('../models/Product');
const { cloudinary } = require('../config/cloudinary');

// @route GET /api/products
const getProducts = async (req, res) => {
  try {
    const { category, search, featured, page = 1, limit = 12 } = req.query;
    const filter = { isActive: true };

    if (category && category !== 'All') filter.category = category;
    if (featured === 'true') filter.featured = true;
    if (search) filter.$text = { $search: search };

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const [products, total] = await Promise.all([
      Product.find(filter).sort({ featured: -1, createdAt: -1 }).skip(skip).limit(parseInt(limit)),
      Product.countDocuments(filter)
    ]);

    res.json({ success: true, products, total, pages: Math.ceil(total / parseInt(limit)), currentPage: parseInt(page) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route GET /api/products/:id
const getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
    res.json({ success: true, product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route POST /api/products (admin)
const createProduct = async (req, res) => {
  try {
    const productData = { ...req.body };
    if (req.file) {
      productData.image = { url: req.file.path, publicId: req.file.filename };
    }
    const product = await Product.create(productData);
    res.status(201).json({ success: true, product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route PUT /api/products/:id (admin)
const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });

    if (req.file) {
      if (product.image?.publicId) {
        await cloudinary.uploader.destroy(product.image.publicId);
      }
      req.body.image = { url: req.file.path, publicId: req.file.filename };
    }

    const updated = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    res.json({ success: true, product: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route DELETE /api/products/:id (admin)
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
    if (product.image?.publicId) await cloudinary.uploader.destroy(product.image.publicId);
    await product.deleteOne();
    res.json({ success: true, message: 'Product deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getProducts, getProduct, createProduct, updateProduct, deleteProduct };
