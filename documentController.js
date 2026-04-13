const Document = require('../models/Document');
const { sendDocumentsEmail } = require('../utils/email');
const { cloudinary } = require('../config/cloudinary');

const getDocuments = async (req, res) => {
  try {
    const filter = req.user ? {} : { isPublic: true };
    const documents = await Document.find(filter).sort({ createdAt: -1 });
    res.json({ success: true, documents });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const createDocument = async (req, res) => {
  try {
    const data = { ...req.body };
    if (req.file) {
      data.file = {
        url: req.file.path,
        publicId: req.file.filename,
        format: req.file.mimetype
      };
    }
    const doc = await Document.create(data);
    res.status(201).json({ success: true, document: doc });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateDocument = async (req, res) => {
  try {
    const doc = await Document.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!doc) return res.status(404).json({ success: false, message: 'Document not found' });
    res.json({ success: true, document: doc });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const deleteDocument = async (req, res) => {
  try {
    const doc = await Document.findByIdAndDelete(req.params.id);
    if (doc?.file?.publicId) await cloudinary.uploader.destroy(doc.file.publicId, { resource_type: 'raw' });
    res.json({ success: true, message: 'Document deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const trackDownload = async (req, res) => {
  try {
    const doc = await Document.findByIdAndUpdate(
      req.params.id,
      { $inc: { downloadCount: 1 } },
      { new: true }
    );
    if (!doc) return res.status(404).json({ success: false, message: 'Document not found' });
    res.json({ success: true, url: doc.file.url });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const requestByEmail = async (req, res) => {
  try {
    const { name, email, documentIds } = req.body;
    if (!name || !email || !documentIds?.length) {
      return res.status(400).json({ success: false, message: 'Name, email, and documents are required' });
    }
    const documents = await Document.find({ _id: { $in: documentIds }, isPublic: true });
    if (!documents.length) {
      return res.status(404).json({ success: false, message: 'No matching documents found' });
    }
    await sendDocumentsEmail({ to: email, name, documents });
    res.json({ success: true, message: 'Documents sent to your email successfully!' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getDocuments, createDocument, updateDocument, deleteDocument, trackDownload, requestByEmail };
