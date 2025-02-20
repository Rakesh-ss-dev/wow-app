const mongoose = require("mongoose");

const PatientSchema = new mongoose.Schema(
    {
      name: { type: String, required: true },  // Corrected
      phone: { type: String, required: true },
      paymentId: { type: String, required: true, unique: true },
      package: { type: mongoose.Schema.Types.ObjectId, ref: "Package" },
      discount:{type:Number,default:0},
      createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Track who added the patient
    },
    { timestamps: true } // Automatically adds createdAt & updatedAt
  );

module.exports = mongoose.model("Patient", PatientSchema);