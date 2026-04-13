const express = require('express');
const router = express.Router();
const { getDocuments, createDocument, updateDocument, deleteDocument, trackDownload, requestByEmail } = require('../controllers/documentController');
const { protect } = require('../middleware/auth');
const { uploadDocument } = require('../config/cloudinary');

router.get('/', getDocuments);
router.post('/', protect, uploadDocument.single('file'), createDocument);
router.put('/:id', protect, updateDocument);
router.delete('/:id', protect, deleteDocument);
router.post('/:id/download', trackDownload);
router.post('/request-email', requestByEmail);

module.exports = router;
