const RFQ = require('../models/RFQ');
const { sendRFQConfirmation, sendAdminRFQAlert } = require('../utils/email');

// @route POST /api/rfq
const createRFQ = async (req, res) => {
  try {
    const rfq = await RFQ.create(req.body);

    // Send emails (non-blocking)
    try {
      await Promise.all([
        sendRFQConfirmation(rfq),
        sendAdminRFQAlert(rfq)
      ]);
    } catch (emailError) {
      console.error('Email sending failed:', emailError.message);
    }

    res.status(201).json({
      success: true,
      message: 'Your quotation request has been submitted successfully!',
      rfqId: rfq._id
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(e => e.message);
      return res.status(400).json({ success: false, message: messages.join(', ') });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route GET /api/rfq (admin)
const getRFQs = async (req, res) => {
  try {
    const { status, priority, page = 1, limit = 20 } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (priority) filter.priority = priority;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const [rfqs, total] = await Promise.all([
      RFQ.find(filter).sort({ leadScore: -1, createdAt: -1 }).skip(skip).limit(parseInt(limit)),
      RFQ.countDocuments(filter)
    ]);

    const stats = {
      total: await RFQ.countDocuments(),
      new: await RFQ.countDocuments({ status: 'New' }),
      inProgress: await RFQ.countDocuments({ status: 'In Progress' }),
      closed: await RFQ.countDocuments({ status: 'Closed' }),
      highPriority: await RFQ.countDocuments({ priority: 'High' })
    };

    res.json({ success: true, rfqs, total, stats, pages: Math.ceil(total / parseInt(limit)) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route PATCH /api/rfq/:id/status (admin)
const updateRFQStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!['New', 'In Progress', 'Closed'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }
    const rfq = await RFQ.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!rfq) return res.status(404).json({ success: false, message: 'RFQ not found' });
    res.json({ success: true, rfq });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route DELETE /api/rfq/:id (admin)
const deleteRFQ = async (req, res) => {
  try {
    await RFQ.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'RFQ deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { createRFQ, getRFQs, updateRFQStatus, deleteRFQ };
