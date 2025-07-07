const mongoose = require('mongoose');

const materialSchema = new mongoose.Schema({
  sessionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Session',
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  title: {
    type: String,
    default: 'Session Material',
  },
  description: {
    type: String,
  },
  fileUrl: {
    type: String,
    required: true, 
  },
  uploadedAt: {
    type: Date,
    default: Date.now,
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
});

module.exports = mongoose.model('Material', materialSchema);
