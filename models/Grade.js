const mongoose = require("mongoose");

const GradeSchema = new mongoose.Schema({
  name: String,
  grades: [Number],
  total: Number,
  exam: String,
  userId: String,
});

module.exports = mongoose.model("Grade", GradeSchema);
