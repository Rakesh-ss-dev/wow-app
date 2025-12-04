const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const Patients = require("../models/Patients");
const User = require("../models/User");

router.get("/:coachId/clients", authMiddleware, async (req, res) => {
  const { coachId } = req.params;
  try {
    const clients = await Patients.find({
      createdBy: coachId,
      status: { $in: ["paid", "active", "old"] },
    })
      .populate("package", "name amount")
      .populate("createdBy", "name email")
      .exec();
    res.status(200).json({ success: true, clients });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get("/coaches", authMiddleware, async (req, res) => {
  try {
    const coaches = await User.find({
      isSuperUser: false,
      isSubUser: { $ne: true },
    })
      .populate("createdBy", "name email")
      .exec();
    res.status(200).json({ success: true, coaches });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
