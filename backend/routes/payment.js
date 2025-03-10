const express = require("express");
const Razorpay = require("razorpay");
const Package = require("../models/Package");
const Patient = require("../models/Patients");
const authMiddleware = require("../middleware/authMiddleware");
const User = require("../models/User");
const Patients = require("../models/Patients");
const XLSX = require("xlsx");
const fs = require("fs");
const path = require("path");
const nodemailer = require("nodemailer");
const router = express.Router();

require("dotenv").config();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const getPaymentDetails = async (requests) => {
  let output = [];
  await Promise.all(
    requests.map(async (request) => {
      const paymentLink = await razorpay.paymentLink.fetch(request.paymentId);
      let tempoutput = {
        ...request._doc,
        status: paymentLink.status,
        url: paymentLink.short_url,
        amount: (paymentLink.amount / 100).toFixed(2),
      };
      output.push(tempoutput);
    })
  );
  return output;
};

// Generate Razorpay Payment Link
router.post("/create-payment-link", authMiddleware, async (req, res) => {
  try {
    const { name, phone, category, discount, finalAmount } = req.body;
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
      callback_url: `${process.env.FRONTEND_URL}/payment_success`,
    };
    const order = await razorpay.paymentLink.create(options);
    const patient = await new Patient({
      name: name,
      phone: phone,
      package: category_from_db,
      paymentId: order.id,
      discount: discount,
      createdBy: req.user,
    });
    await patient.save();
    res.json({ success: true, payment_link: order.short_url });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
});
function replacePlaceholders(template, data) {
  return template.replace(/\[([^\]]+)\]/g, (match, key) => data[key] || match);
}
router.post("/success", async (req, res) => {
  try {
    const payment = await Patient.findOne({
      paymentId: req.body.razorpay_payment_link_id,
    })
      .populate(["createdBy", "package"])
      .exec();
    if(payment.notified===false)
    {
    const amount = payment.package.amount;
    const discount = payment.discount;
    const discountAmount = (amount * (discount / 100)).toFixed();
    const taxAmount = ((amount - discountAmount) * 0.18).toFixed();
    const finalAmount = (
      parseFloat(amount) -
      parseFloat(discountAmount) +
      parseFloat(taxAmount)
    ).toFixed();
    const emailData = {
      "Client Name": payment.name,
      "Coach's Name": payment.createdBy.name,
      "Package Name": payment.package.name,
      "Base Amount": amount.toFixed(2),
      "Discount Amount": parseFloat(discountAmount).toFixed(2),
      "GST Amount": parseFloat(taxAmount).toFixed(2),
      "Final Amount": parseFloat(finalAmount).toFixed(2),
    };
    let emailTemplate = fs.readFileSync(
      "mailers/successful_payment.html",
      "utf8"
    );
    const emailContent = replacePlaceholders(emailTemplate, emailData);
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
    const mailOptions = {
      from: `"WOW Purchase" <${process.env.EMAIL_USER}>`,
      to: `${payment.createdBy.email}`,
      subject: `Payment Confirmation – ${payment.name}`,
      html: emailContent,
    };
    await transporter.sendMail(mailOptions);
    payment.notified=true;
    await payment.save();
    res.json({ success: true, message: "Email sent successfully!" });
  }
  else{
    res.json({ success: true, message: "Already Notified!" });
  }
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ success: false, message: "Failed to send email" });
  }
});
router.get("/user-status/:user_id", async (req, res) => {
  try {
    const { user_id } = req.params;
    const coach = await User.findById(user_id);
    const requests = await Patients.find({ createdBy: coach })
      .populate("package")
      .exec();
    const output = await getPaymentDetails(requests);
    const paidOutput = output.filter((item) => item.status === "paid");
    if (paidOutput.length == 0) {
      res.json({
        success: true,
        message: "No successful payments found in the selected date range.",
      });
    } else {
      const data = paidOutput.map((item) => ({
        Name: item.name,
        Phone: item.phone,
        PaymentID: item.paymentId,
        Package: item.package.name,
        Discount: item.discount + "%",
        Amount: parseFloat(item.amount),
      }));
      const totalAmount = data.reduce(
        (sum, row) => parseFloat(sum.toFixed(2)) + parseFloat(row.Amount),
        0
      );
      data.push({
        Name: "TOTAL",
        Phone: "",
        PaymentID: "",
        Package: "",
        Discount: "",
        Amount: totalAmount,
      });
      // Create a new workbook and worksheet
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(data);

      // Append the worksheet to the workbook
      XLSX.utils.book_append_sheet(wb, ws, "Payments");

      // Define file path
      const filePath = path.join(__dirname, "payments.xlsx");

      // Write Excel file
      XLSX.writeFile(wb, filePath);

      // Send file to frontend
      res.download(filePath, `payments.xlsx`, (err) => {
        if (err) console.error("Error sending file:", err);
        fs.unlinkSync(filePath); // Delete the file after sending
      });
    }
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
      requests = await Patient.find({ createdBy: userData._id })
        .populate("package")
        .exec();
    }
    const output = await getPaymentDetails(requests);
    console.log(output);
    res.json({ success: true, requests: output });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});
module.exports = router;
