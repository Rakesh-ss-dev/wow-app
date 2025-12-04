const mongoose = require("mongoose");

const NutritionistSchema = new mongoose.Schema(
  {
    email: { type: String, unique: true },
    password: { type: String, required: true, select: false },
    name: { type: String },
    phone: { type: String, unique: true },
    mobile: { type: String, unique: false },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

const Nutritionist = mongoose.model("Nutritionist", NutritionistSchema);

module.exports = Nutritionist;
