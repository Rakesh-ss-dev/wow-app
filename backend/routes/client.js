const express = require("express");
const router = express.Router();
const Patient = require("../models/Patients");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const clientMiddleware = require("../middleware/clientMiddleware");
const HealthReport = require("../models/HealthReport");

router.post("/login", async (req, res) => {
  try {
    const { mobile, password } = req.body;
    console.log(mobile, password);
    const patient = await Patient.findOne({ phone: mobile, status: "active" })
      .populate(["createdBy", "package"])
      .exec();
    if (!patient) return res.status(400).json({ error: "User not found" });
    const isMatch = await bcrypt.compare(password, patient.password);
    if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });
    const token = jwt.sign({ id: patient._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    res.json({ token, patient });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Server error", err });
  }
});

router.post("/update", clientMiddleware, async (req, res) => {
  try {
    const { name, dateOfBirth, gender, email, bloodGroup } = req.body;
    const patient = await Patient.findOne({ _id: req.user._id })
      .populate(["createdBy", "package"])
      .exec();
    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }
    patient.name = name;
    patient.date_of_birth = dateOfBirth;
    patient.gender = gender;
    patient.email = email;
    patient.bloodGroup = bloodGroup;
    await patient.save();
    res.status(201).json({ message: "Profile Updated Successfully", patient });
  } catch (err) {
    console.error("Update Error:", err);
    res
      .status(500)
      .json({ message: "Failed to update your Profile", error: err.message });
  }
});

router.post("/change-password", clientMiddleware, async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    if (!oldPassword || !newPassword) {
      return res
        .status(400)
        .json({ error: "Old password and new password are required." });
    }
    const patient = await Patient.findById(req.user._id);
    if (!patient) {
      return res.status(404).json({ error: "User not found." });
    }
    const isMatch = await bcrypt.compare(oldPassword, patient.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Incorrect old password." });
    }
    const salt = await bcrypt.genSalt(10);
    patient.password = await bcrypt.hash(newPassword, salt);
    await patient.save();
    res.json({ success: true, message: "Password updated successfully." });
  } catch (error) {
    console.error("Error changing password:", error);
    res.status(500).json({ error: "Internal server error." });
  }
});

router.post("/addReport", clientMiddleware, async (req, res) => {
  const userId = req.user;
  const date = new Date();
  try {
    const {
      height,
      weight,
      vitaminD,
      vitaminB12,
      iron,
      hba1c,
      triglycerides,
      hdl,
      tsh,
      uricAcid,
    } = req.body;

    const report = new HealthReport({
      userId,
      date,
      height,
      weight,
      vitamins: {
        vitaminD,
        vitaminB12,
        iron,
      },
      diabetesAndLipidProfile: {
        hba1c,
        triglycerides,
        hdl,
      },
      thyroidAndUricAcid: {
        tsh,
        uricAcid,
      },
    });
    const saved = await report.save();
    res.status(201).json({ message: "Report Submitted Successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to save health report", error });
  }
});

router.get("/getRequests", clientMiddleware, async (req, res) => {
  try {
    const requests = await HealthReport.find({ userId: req.user });
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: "Failed to Fetch health reports", error });
  }
});

router.get("/health-metrics", clientMiddleware, async (req, res) => {
  try {
    const latest = await HealthReport.findOne({ userId: req.user })
      .sort({ date: -1 })
      .exec();
    if (!latest) return res.status(404).json({ error: "No data found." });
    res.status(200).json(latest);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch the report", error });
  }
});

module.exports = router;
