const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();
// Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.json({ token, user });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

router.post("/add-user", authMiddleware, async (req, res) => {
  const { email, password, mobile, name } = req.body;
  try {
    let user = await User.findOne({ email });
    if (user)
      return res
        .status(400)
        .json({ success: false, error: "User already exists" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user = new User({
      email,
      password: hashedPassword,
      mobile: mobile,
      name,
    });
    await user.save();
    res.json({ success: true, message: "User created successfully!" });
  } catch (error) {
    res.status(500).json({ success: false, error: "Server error" });
  }
});

router.get("/users", authMiddleware, async (req, res) => {
  try {
    const users = await User.find({ isSuperUser: false }).exec();
    res.json({ success: true, users: users });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
router.post("/update-user", authMiddleware, async (req, res) => {
  try {
    const name = req.body.name;
    const email = req.body.email;
    const mobile = req.body.mobile;
    const user = await User.findOne(req.user._id);
    user.name = name;
    user.email = email;
    user.mobile = mobile;
    await user.save();
    res.json({ success: true, message: "User Profile Updated" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/change-password", authMiddleware, async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    // Validate inputs
    if (!oldPassword || !newPassword) {
      return res.status(400).json({ error: "Both old and new passwords are required." });
    }
    if (newPassword.length < 8) {
      return res.status(400).json({ error: "New password must be at least 8 characters long." });
    }
    if (!/[A-Z]/.test(newPassword)) {
      return res.status(400).json({ error: "New password must contain at least one uppercase letter." });
    }
    if (!/[a-z]/.test(newPassword)) {
      return res.status(400).json({ error: "New password must contain at least one lowercase letter." });
    }
    if (!/\d/.test(newPassword)) {
      return res.status(400).json({ error: "New password must contain at least one number." });
    }
    if (!/[!@#$%^&*]/.test(newPassword)) {
      return res.status(400).json({ error: "New password must contain at least one special character." });
    }

    // Find user by ID
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    // Check if old password matches
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Incorrect old password." });
    }

    // Hash new password and save
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    res.json({ success: true, message: "Password updated successfully." });
  } catch (error) {
    console.error("Error changing password:", error);
    res.status(500).json({ error: "Internal server error." });
  }
});

module.exports = router;
