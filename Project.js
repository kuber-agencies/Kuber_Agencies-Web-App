const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Project title is required'],
    trim: true
  },
  client: {
    type: String,
    required: [true, 'Client name is required']
  },
  department: String,
  value: String,
  location: String,
  startDate: Date,
  endDate: Date,
  status: {
    type: String,
    enum: ['Completed', 'Ongoing'],
    required: true
  },
  description: String,
  category: {
    type: String,
    enum: ['Government', 'Private', 'PSU'],
    default: 'Government'
  },
  highlights: [String],
  image: {
    url: String,
    publicId: String
  }
}, { timestamps: true });

module.exports = mongoose.model('Project', projectSchema);
