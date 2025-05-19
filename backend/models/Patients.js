const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
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
    password: { type: String, default: "" },
    email: { type: String, default: "" },
    date_of_birth: { type: Date, default: "" },
    bloodGroup: { type: String, default: "" },
    gender: { type: String, enum: ["Male", "Female"] },
    payed_at: { type: Date },
    activated_at: { type: Date },
    dueAmount: { type: Number, default: 0 },
    ref: { type: mongoose.Schema.Types.ObjectId, ref: "Patient", default: null },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

PatientSchema.pre("save", async function (next) {
  if (!this.password) {
    const namePart =
      this.name?.replace(/\s+/g, "").substring(0, 4).toLowerCase() || "user";
    const phonePart = this.phone?.slice(-4) || "0000";
    this.password = `${namePart}${phonePart}`;
  }
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});
module.exports = mongoose.model("Patient", PatientSchema);
