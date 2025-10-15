const mongoose = require("mongoose");
const BodyMetricIndex = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  weight: { type: Number, required: true },
  height: { type: Number, required: true },
  bmi: { type: Number, required: true },
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model("BodyMetricIndex", BodyMetricIndex);
