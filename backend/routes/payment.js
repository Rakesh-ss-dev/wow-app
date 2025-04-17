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
const { loadImage } = require("canvas");
const PDFDocument = require("pdfkit");
const nodemailer = require("nodemailer");
const router = express.Router();

require("dotenv").config();

// helper function to format date to indian format
const formatReadableDate = (isoString) => {
  if (!isoString) return "Invalid Date";

  const date = new Date(isoString);

  const day = date.toLocaleString("en-IN", {
    day: "2-digit",
    timeZone: "Asia/Kolkata",
  });
  const month = date.toLocaleString("en-IN", {
    month: "2-digit",
    timeZone: "Asia/Kolkata",
  });
  const year = date.toLocaleString("en-IN", {
    year: "2-digit",
    timeZone: "Asia/Kolkata",
  });
  const time = date.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "Asia/Kolkata",
  });

  return `${day}/${month}/${year}, ${time}`;
};

//helper function to replace placeholders in email template
function replacePlaceholders(template, data) {
  return template.replace(/\[([^\]]+)\]/g, (match, key) => data[key] || match);
}

// creating a razorpay object with keys
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Generate Razorpay Payment Link
router.post("/create-payment-link", authMiddleware, async (req, res) => {
  try {
    const {
      name,
      phone,
      category,
      discount,
      finalAmount,
      tobePaid,
      installment,
    } = req.body;
    const category_from_db = await Package.findOne({ name: category });
    let description = `Payment for your Golden 90 ${category_from_db.name} | Tax: 18%`;
    let amount;
    if (tobePaid == 0) {
      amount = finalAmount * 100;
    } else {
      amount = tobePaid * 100;
    }
    if (discount > 0) {
      description += ` | Discount: ${discount}%`;
    }
    const options = {
      amount: parseInt(amount),
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
      installment: installment,
      createdBy: req.user,
    });
    await patient.save();
    res.json({ success: true, payment_link: order.short_url });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post("/getPaymentDetails", authMiddleware, async (req, res) => {
  try {
    const { request } = req.body;
    const paymentLink = await razorpay.paymentLink.fetch(request.paymentId);
    let output = {
      ...request,
      status: paymentLink.status,
      url: paymentLink.short_url,
      amount: (paymentLink.amount / 100).toFixed(2),
    };
    res.json({ success: true, request: output });
  } catch (err) {
    res.status(500).json({ success: false, message: err });
  }
});

//payment Success
router.post("/success", async (req, res) => {
  try {
    const payment = await Patient.findOne({
      paymentId: req.body.razorpay_payment_link_id,
    })
      .populate(["createdBy", "package"])
      .exec();
    if (payment.notified === false) {
      const amount = payment.package.amount.toFixed(2);
      const discount = payment.discount.toFixed(2);
      const discountAmount = (amount * (discount / 100)).toFixed(2);
      const taxAmount = ((amount - discountAmount) * 0.18).toFixed(2);
      const finalAmount = (
        parseFloat(amount) -
        parseFloat(discountAmount) +
        parseFloat(taxAmount)
      ).toFixed(2);
      const emailData = {
        "Client Name": payment.name,
        "Coach's Name": payment.createdBy.name,
        "Package Name": payment.package.name,
        "Base Amount": parseFloat(amount).toFixed(2),
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
        subject: `Payment Confirmation - ${payment.name}`,
        html: emailContent,
      };
      await transporter.sendMail(mailOptions);
      payment.notified = true;
      await payment.save();
      res.json({ success: true, message: "Email sent successfully!" });
    } else {
      res.json({ success: true, message: "Already Notified!" });
    }
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ success: false, message: "Failed to send email" });
  }
});

//generate Invoice
router.post("/generate-invoice", async (req, res) => {
  try {
    const payment = await Patient.findOne({
      paymentId: req.body.razorpay_payment_link_id,
    })
      .populate(["createdBy", "package"])
      .exec();
    const amount = payment.package.amount.toFixed(2);
    const discount = payment.discount.toFixed(2);
    const discountAmount = (amount * (discount / 100)).toFixed(2);
    const tempAmount = (amount - discountAmount).toFixed(2);
    const taxAmount = (tempAmount * 0.18).toFixed(2);
    const finalAmount = (
      parseFloat(amount) -
      parseFloat(discountAmount) +
      parseFloat(taxAmount)
    ).toFixed(2);
    const paymentDate = formatToISTDate(payment.createdAt);
    const paymentStatus = req.body.razorpay_payment_link_status;
    const image = await loadImage("invoice/Invoice.jpg");
    const invoiceData = [
      { text: req.body.razorpay_payment_id, x: 240, y: 465 },
      { text: paymentDate, x: 130, y: 490 },
      { text: "1", x: 90, y: 730 },
      { text: paymentDate, x: 200, y: 730 },
      { text: payment.package.name, x: 450, y: 730 },
      { text: "1", x: 730, y: 730 },
      { text: amount, x: 880, y: 730 },
      { text: amount, x: 800, y: 880 },
      { text: discountAmount, x: 800, y: 915 },
      { text: tempAmount, x: 800, y: 970 },
      { text: taxAmount, x: 800, y: 1005 },
      { text: finalAmount, x: 800, y: 1060 },
      { text: finalAmount, x: 800, y: 1095 },
      { text: "1", x: 150, y: 1300 },
      { text: finalAmount, x: 430, y: 1300 },
      { text: paymentDate, x: 660, y: 1300 },
      { text: paymentStatus, x: 880, y: 1300 },
    ];
    const pdfDoc = new PDFDocument({ size: [image.width, image.height] });
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "attachment; filename=invoice.pdf");
    pdfDoc.pipe(res);
    pdfDoc.image("invoice/Invoice.jpg", 0, 0, {
      width: image.width,
      height: image.height,
    });
    pdfDoc.registerFont("Poppins", "fonts/Poppins-Regular.ttf");
    pdfDoc.font("Poppins").fontSize(20).fillColor("black");
    invoiceData.forEach(({ text, x, y }) => {
      pdfDoc.text(text, x, y);
    });
    pdfDoc.end();
  } catch (error) {
    console.error("Error generating invoice:", error);
    res.status(500).json({ error: "Failed to generate invoice" });
  }
});

//generating reports from start date to end date
router.post("/user-status/", async (req, res) => {
  try {
    const { startDate, endDate } = req.body;
    const users = await User.find({ isSuperUser: false }).exec();
    const wb = XLSX.utils.book_new();
    const adjustedEndDate = new Date(endDate);
    adjustedEndDate.setHours(23, 59, 59, 999);
    for (const user of users) {
      const requests = await Patients.find({
        createdBy: user._id,
        createdAt: {
          $gte: new Date(startDate),
          $lte: adjustedEndDate,
        },
      })
        .sort({ createdAt: -1 })
        .populate("package")
        .exec();
      const paidOutput = requests
        .filter((item) => item.status === "paid")
        .sort(
          (a, b) =>
            new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
        );
      if (paidOutput.length > 0) {
        const data = paidOutput.map((item) => ({
          Name: item.name,
          Phone: item.phone,
          PaymentID: item.paymentId,
          Package: item.package.name,
          Discount: item.discount + "%",
          Created_Date: formatReadableDate(item.createdAt),
          Paid_Date: formatReadableDate(item.payed_at),
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
          Created_Date: "",
          Paid_Date: "",
          Amount: totalAmount,
        });

        const ws = XLSX.utils.json_to_sheet(data);
        XLSX.utils.book_append_sheet(wb, ws, user.name);
      }
    }
    const filePath = path.join(__dirname, "payments.xlsx");
    XLSX.writeFile(wb, filePath);
    res.download(filePath, `payments.xlsx`, (err) => {
      if (err) console.error("Error sending file:", err);
      fs.unlinkSync(filePath);
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error });
  }
});

//get Details of all the requests made
router.get("/get_requests", authMiddleware, async (req, res) => {
  try {
    const user = req.user;
    const userData = await User.findById(user);
    let requests;
    if (userData.isSuperUser) {
      requests = await Patient.find({})
        .populate("package", "name amount")
        .populate("createdBy", "name email")
        .exec();
    } else {
      requests = await Patient.find({ createdBy: userData._id })
        .populate("package", "name amount")
        .exec();
    }
    res.json({ success: true, requests: requests });
  } catch (error) {
    res.status(500).json({ success: false, message: error });
  }
});


module.exports = router;
