const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const productStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'kuber-agencies/products',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp']
  }
});

const documentStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'kuber-agencies/documents',
    allowed_formats: ['pdf', 'jpg', 'jpeg', 'png'],
    resource_type: 'raw'
  }
});

const uploadProduct = multer({ storage: productStorage });
const uploadDocument = multer({ storage: documentStorage });

module.exports = { cloudinary, uploadProduct, uploadDocument };
