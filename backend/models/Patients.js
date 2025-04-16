const mongoose = require("mongoose");

const PatientSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    paymentId: { type: String, required: true, unique: true },
    package: { type: mongoose.Schema.Types.ObjectId, ref: "Package" },
    discount: { type: Number, default: 0 },
    installment: { type: String, default: "", trim: true },
    notified: { type: Boolean, default: false },
    amount: { type: Number, default: 0 },
    status: { type: String, default: "created" },
    currency: { type: String, default: "INR" },
    method: { type: String, default: "" },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Patient", PatientSchema);
