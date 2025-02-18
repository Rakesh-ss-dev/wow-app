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
  
      const token = jwt.sign({ id:user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });
  
      res.json({ token, user});
    } catch (error) {
      res.status(500).json({ error: "Server error" });
    }
});


router.post("/add-user",authMiddleware, async (req, res) => {
  const { email, password,mobile ,name } = req.body;
  try {
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ success:false,error: "User already exists" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user = new User({
      email,
      password: hashedPassword,
      mobile:mobile,
      name,
    });
    await user.save();
    res.json({success:true, message: "User created successfully!" });
  } catch (error) {
    res.status(500).json({success:false, error: "Server error" });
  }
});

router.get('/users',authMiddleware,async(req,res)=>{
  try{
    const users= await User.find({isSuperUser:false}).exec();
    res.json({success:true,users:users})
  }
  catch(error){
    res.status(500).json({error:error.message})
  }
})

module.exports = router;
