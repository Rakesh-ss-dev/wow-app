const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();
// Login
router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    try {
      const user = await User.findOne({ email });
      if (!user) return res.status(400).json({ error: "User not found" });
  
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });
  
      const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: "1h" });
  
      res.json({ token, user: { email } });
    } catch (error) {
      res.status(500).json({ error: "Server error" });
    }
});


// Create a new user (manually adding credentials)
router.post("/add-user", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if the user already exists
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ error: "User already exists" });

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    user = new User({
      email,
      password: hashedPassword,
    });

    // Save to MongoDB
    await user.save();

    res.json({ message: "User created successfully!" });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
