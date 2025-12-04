const express = require("express");
const bcrypt = require("bcryptjs");
const router = express.Router();
const Nutritionist = require("../models/Nutritionist");

router.post("/create-nutritionist", async (req, res) => {
  try {
    const { email, password, name, phone, coachId } = req.body;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newNutritionist = new Nutritionist({
      email,
      password: hashedPassword,
      name,
      phone,
      mobile: phone,
      assignedTo: coachId,
    });
    await newNutritionist.save();
    res
      .status(201)
      .json({ newNutritionist, message: "Nutritionist created successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get("/nutritionists", async (req, res) => {
  try {
    const nutritionists = await Nutritionist.find({})
      .populate("assignedTo", "id name email")
      .exec();
    res.status(200).json(nutritionists);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
