const express = require("express");
const Razorpay = require("razorpay");
const crypto = require("crypto");
const Package = require('../models/Package')
const router = express.Router();

require("dotenv").config();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Generate Razorpay Payment Link
router.post("/create-payment-link", async (req, res) => {
  try {
    const { name, phone , category } = req.body; // Get input from frontend
    const category_from_db = await Package.findOne({name:category});
    const amount=category_from_db.amount;
    const options = {
      customer: {
      name: name,
      contact: `+91${phone}`,
        },
      amount: amount * 100, // Convert to paisa
      currency: category_from_db.currency,
      receipt: `receipt_${Date.now()}`,
      payment_capture: 1,
    };
    const order = await razorpay.orders.create(options);
    res.json({
      success: true,
      order_id: order.id,
      amount: order.amount,
      currency: order.currency,
      payment_link: `https://api.razorpay.com/v1/checkout/embedded?order_id=${order.id}`, // Razorpay Payment Link
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
