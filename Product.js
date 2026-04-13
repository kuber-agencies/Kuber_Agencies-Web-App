const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
    maxlength: [200, 'Name cannot exceed 200 characters']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['Pipes', 'Fittings', 'Electrical', 'Tools', 'Other']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    maxlength: [2000, 'Description cannot exceed 2000 characters']
  },
  image: {
    url: String,
    publicId: String
  },
  bulkPricingNote: {
    type: String,
    default: 'Contact us for bulk pricing'
  },
  specifications: [{
    key: String,
    value: String
  }],
  brand: String,
  unit: {
    type: String,
    default: 'piece'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  featured: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

productSchema.index({ name: 'text', description: 'text' });

module.exports = mongoose.model('Product', productSchema);
