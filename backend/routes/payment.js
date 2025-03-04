const express = require("express");
const Razorpay = require("razorpay");
const crypto = require("crypto");
const Package = require("../models/Package");
const Patient = require("../models/Patients");
const authMiddleware = require("../middleware/authMiddleware");
const { request } = require("http");
const User = require("../models/User");
const router = express.Router();

require("dotenv").config();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Generate Razorpay Payment Link
router.post("/create-payment-link", authMiddleware, async (req, res) => {
  try {
    const { name, phone, category, discount,finalAmount } = req.body;
    const category_from_db = await Package.findOne({ name: category });
    let description = `Payment for your Golden 90 ${category_from_db.name} | Tax: 18%`;
    if (discount > 0) {
      description += ` | Discount: ${discount}%`;
    }
    const options = {
      amount: parseInt(finalAmount) * 100,
      currency: category_from_db.currency,
      accept_partial: false,
      description: description,
      customer: {
        name: name,
        contact: `+91${phone}`,
      },
      notify: {
        sms: true,
        email: true,
        whatsapp: true,
      },
      reminder_enable: true,
      callback_method: "get",
    };
    const order = await razorpay.paymentLink.create(options);
    const patient = await new Patient({
      name: name,
      phone: phone,
      package: category_from_db,
      paymentId: order.id,
      discount:discount,
      createdBy: req.user,
    });
    await patient.save();
    res.json({ success: true, payment_link: order.short_url });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get("/payment-status/:plink_id", authMiddleware, async (req, res) => {
  try {
    const { plink_id } = req.params;
    const paymentLink = await razorpay.paymentLink.fetch(plink_id);
    res.json({
      success: true,
      payment_id: paymentLink.id,
      status: paymentLink.status, // Possible values: created, sent, paid, expired
      amount: paymentLink.amount / 100, // Convert from paise
      currency: paymentLink.currency,
      email: paymentLink.customer?.email,
      created_at: new Date(paymentLink.created_at * 1000).toLocaleString(),
      updated_at: new Date(paymentLink.updated_at * 1000).toLocaleString(),
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get("/get_requests", authMiddleware, async (req, res) => {
  try {
    const user = req.user;
    const userData = await User.findById(user);
    let requests;
    if (userData.isSuperUser) {
      requests = await Patient.find({})
        .populate(["package", "createdBy"])
        .exec();
    } else {
      requests = await Patient.find({ createdBy: user._id })
        .populate("package")
        .exec();
    }
    let output = [];
    await Promise.all(
      requests.map(async (request) => {
        const paymentLink = await razorpay.paymentLink.fetch(request.paymentId);
        let tempoutput = {
          ...request._doc,
          status: paymentLink.status,
          url: paymentLink.short_url,
          amount: (paymentLink.amount/100).toFixed(2)
        };
        output.push(tempoutput);
      })
    );
    res.json({ success: true, requests: output });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});
module.exports = router;
