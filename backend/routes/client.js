const express = require("express");
const router = express.Router();
const Patient = require("../models/Patients");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const clientMiddleware = require("../middleware/clientMiddleware");
const HealthReport = require("../models/HealthReport")
router.get("/add-password", async (req, res) => {
  const patients = await Patient.find({ status: 'paid' });
  console.log(patients);
  patients.map(async (patient) => {
    console.log(patient);
    patient.save();
  });
});
router.post("/login", async (req, res) => {
  try {
    const { mobile, password } = req.body;
    const patient = await Patient.findOne({ phone: mobile, status: "paid" });
    if (!patient) return res.status(400).json({ error: "User not found" });
    console.log(patient);
    const isMatch = await bcrypt.compare(password, patient.password);
    console.log(process.env.JWT_SECRET);
    if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });
    const token = jwt.sign({ id: patient._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    res.json({ token, patient });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Server error", err });
  }
});

router.post('/addReport',clientMiddleware,async(req,res)=>{
const userId=req.user;
const date=new Date();
  try {
    const {
      height,
      weight,
      vitaminD,
      vitaminB12,
      iron,
      hba1c,
      triglycerides,
      hdl,
      tsh,
      uricAcid,
    } = req.body;

    const report = new HealthReport({
      userId,
      date,
      height,
      weight,
      vitamins: {
        vitaminD,
        vitaminB12,
        iron,
      },
      diabetesAndLipidProfile: {
        hba1c,
        triglycerides,
        hdl,
      },
      thyroidAndUricAcid: {
        tsh,
        uricAcid,
      },
    });
    const saved = await report.save();
    res.status(201).json({message:"Report Submitted Successfully"});
  } catch (error) {
    res.status(500).json({ message: 'Failed to save health report',error });
  }
})

router.get('/getRequests',clientMiddleware,async(req,res)=>{
    try{
        const requests = await HealthReport.find({userId:req.user});
        res.json(requests)
    }
    catch(error){
        res.status(500).json({ message: 'Failed to Fetch health reports',error });
    }
})
module.exports = router;
