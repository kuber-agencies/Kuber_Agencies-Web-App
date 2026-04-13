const mongoose = require('mongoose');

const rfqSchema = new mongoose.Schema({
  productName: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true
  },
  quantity: {
    type: Number,
    required: [true, 'Quantity is required'],
    min: [1, 'Quantity must be at least 1']
  },
  unit: {
    type: String,
    default: 'pieces'
  },
  deliveryLocation: {
    type: String,
    required: [true, 'Delivery location is required']
  },
  deadline: {
    type: Date,
    required: [true, 'Deadline is required']
  },
  name: {
    type: String,
    required: [true, 'Contact name is required']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email']
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    match: [/^[6-9]\d{9}$/, 'Please provide a valid Indian phone number']
  },
  company: String,
  additionalNotes: String,
  status: {
    type: String,
    enum: ['New', 'In Progress', 'Closed'],
    default: 'New'
  },
  priority: {
    type: String,
    enum: ['Low', 'Medium', 'High'],
    default: 'Medium'
  },
  leadScore: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

// Lead scoring logic pre-save
rfqSchema.pre('save', function (next) {
  let score = 0;

  // High quantity = higher score
  if (this.quantity >= 1000) score += 40;
  else if (this.quantity >= 500) score += 25;
  else if (this.quantity >= 100) score += 15;
  else score += 5;

  // Urgency: deadline within 7 days = high priority
  const daysUntilDeadline = Math.ceil((new Date(this.deadline) - new Date()) / (1000 * 60 * 60 * 24));
  if (daysUntilDeadline <= 7) score += 40;
  else if (daysUntilDeadline <= 30) score += 20;
  else score += 5;

  // Company provided = more serious lead
  if (this.company) score += 20;

  this.leadScore = score;

  if (score >= 70) this.priority = 'High';
  else if (score >= 40) this.priority = 'Medium';
  else this.priority = 'Low';

  next();
});

module.exports = mongoose.model('RFQ', rfqSchema);
