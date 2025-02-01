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
    const { name, phone , category } = req.body;
    const category_from_db = await Package.findOne({name:category});
    const amount=category_from_db.amount;
    const options={
      amount: amount * 100, // Amount in paise (1 INR = 100 paise)
      currency: category_from_db.currency,
      accept_partial: false,
      description: `Payment for your Golden 90 ${category_from_db.name}`,
      customer: {
        name:name,
        contact:`+91${phone}`,
      },
      notify: {
        sms: true,
        email: true,
        whatsapp:true,
      },
      reminder_enable: true,
      callback_method: "get",
    }
    const order = await razorpay.paymentLink.create(options);
    res.json({ success: true,payment_link:order.short_url });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
