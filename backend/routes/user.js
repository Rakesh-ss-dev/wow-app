const express = require("express");
const router = express.Router();
const DailyWeight = require("../models/DailyWeight");
const Diabetes = require("../models/Diabetes");
const HealthReport = require("../models/HealthReport");
const authMiddleware = require("../middleware/authMiddleware");
router.post("/weightInput/:userId", authMiddleware, async (req, res) => {
  const today = new Date();
  const dateOnly = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate()
  );
  const { value } = req.body;
  const { userId } = req.params;
  try {
    await DailyWeight.findOneAndUpdate(
      { userId: userId, date: dateOnly },
      { $set: { weight: value } },
      { upsert: true, new: true }
    );
    res
      .status(201)
      .json({ success: true, message: "Weight submitted successfully!" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post("/fasting-sugar/:userId", authMiddleware, async (req, res) => {
  const { fastingValue } = req.body;
  const today = new Date();
  const dateOnly = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate()
  );
  const { userId } = req.params;
  try {
    await Diabetes.findOneAndUpdate(
      { userId: userId, date: dateOnly },
      { $set: { fastingValue } },
      { upsert: true, new: true }
    );
    res.status(201).json({
      success: true,
      message: "Fasting Sugar submitted successfully!",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post("/random-sugar/:userId", authMiddleware, async (req, res) => {
  const { randomValue } = req.body;
  const today = new Date();
  const dateOnly = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate()
  );
  const { userId } = req.params;
  try {
    await Diabetes.findOneAndUpdate(
      { userId: userId, date: dateOnly },
      { $set: { randomValue } },
      { upsert: true, new: true }
    );
    res.status(201).json({
      success: true,
      message: "Random Sugar submitted successfully!",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});
router.post("/add-values/:userId", authMiddleware, async (req, res) => {
  const { userId } = req.params;
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
    await report.save();
    res.status(201).json({ message: "Report Submitted Successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to save health report", error });
  }
});

module.exports = router;
