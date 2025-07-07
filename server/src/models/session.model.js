var mongoose = require("mongoose");

const sessionSchema = new mongoose.Schema({
  sessionName: {
    type: String,
    required: true,
    trim: true,
  },
  subject: {
    type: String,
    required: true,
    trim: true,
  },
  timeSlot: {
    startTime: {
      type: String,
      required: true,
    },
    endTime: {
      type: String,
      required: true,
    },
  },
  sessionType: {
    type: String,
    enum: ["Single", "Week-Long", "Semester-Long", "Custom"],
    required: true,
  },
  dates: {
    type: [String],
    required: true,
  },
  classroom: {
    type: String,
    required: true,
  },
  bookedSeats : {
    type: Number,
    default: 0
  },
  maxSeats: {
    type: Number,
    required: true,
  },
  teacherId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  programme: {
    type: String,
    required: true,
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Session", sessionSchema);
