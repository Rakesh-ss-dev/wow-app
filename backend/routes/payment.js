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
const { default: mongoose } = require("mongoose");
const HealthReport = require("../models/HealthReport");
const router = express.Router();

require("dotenv").config();
function processPaymentsData(data) {
  let totalINR = 0;
  let totalUSD = 0;

  // Format the data into the desired structure
  const formattedData = data.map((entry) => {
    console.log(entry);
    const {
      name,
      phone,
      paymentId,
      package: pkg,
      discount,
      createdAt,
      payed_at,
      amount,
      currency,
    } = entry;

    // Convert dates to human-readable format
    const createdDate = new Date(createdAt).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
    const paidDate = payed_at
      ? new Date(payed_at).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        })
      : "N/A";

    // Construct formatted entry
    const formattedEntry = {
      Name: name,
      Phone: phone,
      PaymentID: paymentId,
      Package: pkg.name || "unknown", // Default to 'unknown' if no package is provided
      Discount: `${discount}%`,
      Created_Date: createdDate,
      Paid_Date: paidDate || "unknown",
      [`Amount_${currency}`]: amount,
    };

    // Sum totals based on currency
    if (currency === "INR") totalINR += amount;
    if (currency === "USD") totalUSD += amount;

    return formattedEntry;
  });

  // Return final output with totals
  return {
    data: formattedData,
    Total_INR: totalINR,
    Total_USD: totalUSD,
  };
}

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
    if (parseFloat(tobePaid) == 0) {
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
      amount: finalAmount,
      dueAmount:
        tobePaid == 0
          ? 0
          : parseFloat(finalAmount).toFixed(2) -
            parseFloat(tobePaid).toFixed(2),
    });
    await patient.save();
    res.json({ success: true, payment_link: order.short_url });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post("/request-installment", authMiddleware, async (req, res) => {
  const { id, dueAmount } = req.body;
  try {
    const patient = await Patient.findById(id);
    if (!patient) {
      return res
        .status(404)
        .json({ success: false, message: "Patient not found" });
    }
    const categoryfromdb = await Package.findById(patient.package);
    let description = `Payment for your Golden 90 ${categoryfromdb.name} | Tax: 18%`;
    let amount = dueAmount.toFixed(2) * 100;
    if (patient.discount > 0) {
      description += ` | Discount: ${patient.discount}%`;
    }
    const options = {
      amount: parseInt(amount),
      currency: categoryfromdb.currency,
      accept_partial: false,
      description: description,
      customer: {
        name: patient.name,
        contact: `+91${patient.phone}`,
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
    const newPatient = await new Patient({
      name: patient.name,
      phone: patient.phone,
      package: patient.package,
      paymentId: order.id,
      discount: patient.discount,
      installment: "Installment 2",
      createdBy: req.user,
      amount: patient.amount,
      dueAmount: 0,
      ref: id,
    });
    await newPatient.save();
    res.json({ success: true, payment_link: order.short_url });
  } catch (error) {
    console.error("Error fetching patient:", error);
    return res
      .status(500)
      .json({ success: false, message: "Failed to fetch patient" });
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
    let payment;
    try {
      payment = await Patient.findOne({
        paymentId: req.body.razorpay_payment_link_id,
      })
        .populate(["createdBy", "package"])
        .exec();
      if (!payment) throw new Error("Payment record not found.");
    } catch (err) {
      console.error("Error fetching payment:", err);
      return res.status(500).json({ success: false, message: "Error fetching payment." });
    }

    if (payment.notified === false) {
      let amount, discount, discountAmount, taxAmount;
      try {
        amount = parseFloat(payment.package.amount || 0).toFixed(2);
        discount = parseFloat(payment.discount || 0).toFixed(2);
        discountAmount = (amount * (discount / 100)).toFixed(2);
        taxAmount = ((amount - discountAmount) * 0.18).toFixed(2);
      } catch (err) {
        console.error("Error calculating amounts:", err);
        return res.status(500).json({ success: false, message: "Error calculating amounts." });
      }

      let finalAmount, dueAmount, payedAmount;
      try {
        if (payment.installment === "Installment 2") {
          const parent = mongoose.Types.ObjectId.isValid(payment.ref)
            ? await Patient.findById(payment.ref)
            : null;
          if (!parent) throw new Error("Parent record not found for Installment 2.");

          finalAmount = parseFloat(parent.amount || 0).toFixed(2);
          dueAmount = 0;
          payedAmount = parseFloat(payment.amount || 0).toFixed(2);
          parent.dueAmount = 0;
          await parent.save();
        } else {
          finalAmount = (
            parseFloat(amount) - 
            parseFloat(discountAmount) + 
            parseFloat(taxAmount)
          ).toFixed(2);
          dueAmount = parseFloat(payment.dueAmount || 0).toFixed(2);
          payedAmount = (parseFloat(finalAmount) - parseFloat(dueAmount)).toFixed(2);
        }
      } catch (err) {
        console.error("Error calculating final/due/payed amounts:", err);
        return res.status(500).json({ success: false, message: "Error calculating payment details." });
      }

      let emailContent;
      try {
        const emailData = {
          "Client Name": payment.name,
          "Coach's Name": payment.createdBy?.name || "N/A",
          "Package Name": payment.package?.name || "N/A",
          "Base Amount": amount,
          "Discount Amount": discountAmount,
          "GST Amount": taxAmount,
          "Final Amount": finalAmount,
          "Amount Paid": payedAmount,
          "Due Amount": dueAmount,
        };

        let emailTemplate = fs.readFileSync("mailers/successful_payment.html", "utf8");
        emailContent = replacePlaceholders(emailTemplate, emailData);
      } catch (err) {
        console.error("Error generating email content:", err);
        return res.status(500).json({ success: false, message: "Error generating email content." });
      }

      try {
        const transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
          },
        });

        const mailOptions = {
          from: `"WOW Purchase" <${process.env.EMAIL_USER}>`,
          to: payment.createdBy?.email || "no-reply@example.com",
          subject: `Payment Confirmation - ${payment.name}`,
          html: emailContent,
        };

        await transporter.sendMail(mailOptions);
      } catch (err) {
        console.error("Error sending email:", err);
        return res.status(500).json({ success: false, message: "Error sending email." });
      }

      try {
        payment.notified = true;
        payment.status = "paid";
        payment.payed_at = new Date();
        await payment.save();
        res.json({ success: true, message: "Email sent successfully!" });
      } catch (err) {
        console.error("Error updating payment status:", err);
        return res.status(500).json({ success: false, message: "Error updating payment status." });
      }
    } else {
      res.json({ success: true, message: "Already Notified!" });
    }
  } catch (error) {
    console.error("Unexpected Error:", error);
    res.status(500).json({ success: false, message: "Unexpected Error Occurred." });
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
    const paymentDate = formatReadableDate(payment.createdAt);
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
    const users = await User.find({}).exec();
    const wb = XLSX.utils.book_new();
    const adjustedEndDate = new Date(endDate);
    adjustedEndDate.setHours(23, 59, 59, 999);
    for (const user of users) {
      const requests = await Patients.find({
        createdBy: user._id,
        status: { $in: ["paid", "active", "old"] },
        payed_at: {
          $gte: new Date(startDate),
          $lte: adjustedEndDate,
        },
      })
        .sort({ createdAt: -1 })
        .populate("package")
        .exec();

      if (requests.length > 0) {
        const formattedData = processPaymentsData(requests);
        const data = formattedData.data;
        data.push({
          Name: "TOTAL_INR",
          Phone: "",
          PaymentID: "",
          Package: "",
          Discount: "",
          Created_Date: "",
          Paid_Date: "",
          Amount_INR: formattedData.Total_INR,
        });
        data.push({
          Name: "TOTAL_USD",
          Phone: "",
          PaymentID: "",
          Package: "",
          Discount: "",
          Created_Date: "",
          Paid_Date: "",
          Amount_USD: formattedData.Total_USD,
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

// Details of all the paid requests made
router.get("/get_requests", authMiddleware, async (req, res) => {
  try {
    const user = req.user;
    const userData = await User.findById(user);
    let requests;
    if (userData.isSuperUser) {
      requests = await Patient.find({
        status: { $in: ["paid", "active", "old"] },
      })
        .populate("package", "name amount")
        .populate("createdBy", "name email")
        .exec();
    } else {
      requests = await Patient.find({
        createdBy: userData._id,
        status: { $in: ["paid", "active", "old"] },
      })
        .populate("package", "name amount")
        .exec();
    }
    res.json({ success: true, requests: requests });
  } catch (error) {
    res.status(500).json({ success: false, message: error });
  }
});

router.get("/get-installments", authMiddleware, async (req, res) => {
  try {
    const user = req.user;
    const userData = await User.findById(user);
    let requests;
    if (userData.isSuperUser) {
      requests = await Patient.find({
        installment: "Installment 1",
        dueAmount: { $gt: 0 },
        status: { $in: ["paid", "active", "old"] },
      });
    } else {
      requests = await Patient.find({
        installment: "Installment 1",
        createdBy: userData._id,
        dueAmount: { $gt: 0 },
        status: { $in: ["paid", "active", "old"] },
      });
    }
    res.json({ success: true, installments: requests });
  } catch (err) {
    res.status(500).json({ success: false, message: err });
  }
});
//

router.get("/get_active_users", authMiddleware, async (req, res) => {
  try {
    const user = req.user;
    const userData = await User.findById(user);
    let requests;
    if (userData.isSuperUser) {
      requests = await Patient.find({
        status: "active",
        installment: { $ne: "Installment 2" },
      })
        .populate("package", "name amount")
        .populate("createdBy", "name email")
        .exec();
    } else {
      requests = await Patient.find({
        createdBy: userData._id,
        status: "active",
        installment: { $ne: "Installment 2" },
      })
        .populate("package", "name amount")
        .exec();
    }
    res.json({ success: true, requests: requests });
  } catch (error) {
    res.status(500).json({ success: false, message: error });
  }
});

router.get("/get_paid_users", authMiddleware, async (req, res) => {
  try {
    const user = req.user;
    const userData = await User.findById(user);
    let requests;
    if (userData.isSuperUser) {
      requests = await Patient.find({
        status: "paid",
        installment: { $ne: "Installment 2" },
      })
        .populate("package", "name amount")
        .populate("createdBy", "name email")
        .exec();
    } else {
      requests = await Patient.find({
        createdBy: userData._id,
        status: "paid",
        installment: { $ne: "Installment 2" },
      })
        .populate("package", "name amount")
        .exec();
    }
    res.json({ success: true, requests: requests });
  } catch (error) {
    res.status(500).json({ success: false, message: error });
  }
});
router.get("/get_old_users", authMiddleware, async (req, res) => {
  try {
    const user = req.user;
    const userData = await User.findById(user);
    let requests;
    if (userData.isSuperUser) {
      requests = await Patient.find({
        status: "old",
        installment: { $ne: "Installment 2" },
      })
        .populate("package", "name amount")
        .populate("createdBy", "name email")
        .exec();
    } else {
      requests = await Patient.find({
        createdBy: userData._id,
        status: "old",
        installment: { $ne: "Installment 2" },
      })
        .populate("package", "name amount")
        .exec();
    }
    res.json({ success: true, requests: requests });
  } catch (error) {
    res.status(500).json({ success: false, message: error });
  }
});

router.post("/make_active", authMiddleware, async (req, res) => {
  try {
    const { id, from } = req.body;
    const user = await Patient.findById(id);
    const namePart =
      user.name?.replace(/\s+/g, "").substring(0, 4).toLowerCase() || "user";
    const phonePart = user.phone?.slice(-4) || "0000";
    const password = `${namePart}${phonePart}`;
    user.status = "active";
    if (from === "paid") {
      user.activated_at = new Date();
    }
    await user.save();
    res.json({
      success: true,
      message: `User activated!! Now  the user can login using phone number as username and password :${password} `,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error });
  }
});

router.post("/deactivate_user", authMiddleware, async (req, res) => {
  try {
    const { id } = req.body;
    const user = await Patient.findById(id);
    user.status = "old";
    await user.save();
    res.json({
      success: true,
      message: `User deactivated !!`,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error });
  }
});

// Details of all the paid requests made
router.get("/get_pending_requests", authMiddleware, async (req, res) => {
  try {
    const user = req.user;
    const userData = await User.findById(user);
    let requests;
    if (userData.isSuperUser) {
      requests = await Patient.find({
        status: { $nin: ["paid", "active", "old"] },
      })
        .populate("package", "name amount")
        .populate("createdBy", "name email")
        .exec();
    } else {
      requests = await Patient.find({
        createdBy: userData._id,
        status: { $nin: ["paid", "active", "old"] },
      })
        .populate("package", "name amount")
        .exec();
    }
    res.json({ success: true, requests: requests });
  } catch (error) {
    res.status(500).json({ success: false, message: error });
  }
});

router.get("/getRequests/:userId", authMiddleware, async (req, res) => {
  try {
    const { userId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user ID format" });
    }
    const user = await Patient.findById(userId).populate("package").exec();
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const requests = await HealthReport.find({ userId: user._id });
    res.status(200).json({ requests, user });
  } catch (error) {
    console.error("Error fetching health reports:", error);
    res.status(500).json({
      message: "Failed to fetch health reports",
      error: error.message,
    });
  }
});

router.get("/health-metrics/:userId", authMiddleware, async (req, res) => {
  try {
    const { userId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user ID format" });
    }
    const user = await Patient.findById(userId).populate("package").exec();
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const latest = await HealthReport.findOne({ userId: user._id })
      .sort({ date: -1 })
      .exec();
    if (!latest) return res.status(404).json({ error: "No data found." });
    res.status(200).json({ latest, user });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch the report", error });
  }
});

module.exports = router;
