const Project = require('../models/Project');
const { cloudinary } = require('../config/cloudinary');

const getProjects = async (req, res) => {
  try {
    const { status, category } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (category) filter.category = category;
    const projects = await Project.find(filter).sort({ createdAt: -1 });
    res.json({ success: true, projects });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const createProject = async (req, res) => {
  try {
    const data = { ...req.body };
    if (req.file) data.image = { url: req.file.path, publicId: req.file.filename };
    const project = await Project.create(data);
    res.status(201).json({ success: true, project });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ success: false, message: 'Project not found' });
    if (req.file) {
      if (project.image?.publicId) await cloudinary.uploader.destroy(project.image.publicId);
      req.body.image = { url: req.file.path, publicId: req.file.filename };
    }
    const updated = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, project: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const deleteProject = async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    if (project?.image?.publicId) await cloudinary.uploader.destroy(project.image.publicId);
    res.json({ success: true, message: 'Project deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getProjects, createProject, updateProject, deleteProject };
