const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["admin", "teacher", "student"], required: true },

  // Student-Specific Fields
  registerNumber: { type: String, unique: true, sparse: true }, // Only for students
  programme: { type: String }, // Example: "B.Sc Computer Science"

  // Teacher-Specific Fields
  subjectsTeaching: [
      { type: String } // Example: "Mathematics"
  ],

  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("User", UserSchema);
