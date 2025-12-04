const express = require("express");
const router = express.Router();
const Nutritionist = require("../models/Nutritionist");

router.post("/nutritionists", async (req, res) => {
  try {
    const { email, password, name, mobile } = req.body;
    const newNutritionist = new Nutritionist({ email, password, name, mobile });
    await newNutritionist.save();
    res.status(201).json(newNutritionist);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
