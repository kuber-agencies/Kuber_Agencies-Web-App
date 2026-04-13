const express = require('express');
const router = express.Router();
const { getProjects, createProject, updateProject, deleteProject } = require('../controllers/projectController');
const { protect } = require('../middleware/auth');
const { uploadProduct } = require('../config/cloudinary');

router.get('/', getProjects);
router.post('/', protect, uploadProduct.single('image'), createProject);
router.put('/:id', protect, uploadProduct.single('image'), updateProject);
router.delete('/:id', protect, deleteProject);

module.exports = router;
