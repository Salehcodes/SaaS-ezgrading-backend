const mongoose = require("mongoose");

const GradeSchema = new mongoose.Schema({
  name: String,
  grades: [Number],
  total: Number,
  exam: String,
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

module.exports = mongoose.model("Grade", GradeSchema);
