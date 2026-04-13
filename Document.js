const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Document name is required'],
    trim: true
  },
  type: {
    type: String,
    enum: ['GST Certificate', 'PAN Card', 'Company Registration', 'Trade License', 'Company Profile', 'Product Catalog', 'Other'],
    required: true
  },
  file: {
    url: String,
    publicId: String,
    format: String
  },
  description: String,
  isPublic: {
    type: Boolean,
    default: true
  },
  downloadCount: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

module.exports = mongoose.model('Document', documentSchema);
