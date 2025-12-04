const mongoose = require("mongoose");

const NutritionistSchema = new mongoose.Schema({
  email: { type: String, unique: true },
  password: String,
  name: { type: String },
  mobile: { type: String, unique: true },
});

const Nutritionist = mongoose.model("Nutritionist", NutritionistSchema);

module.exports = Nutritionist;
