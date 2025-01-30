require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt =require('bcryptjs');

const app = express();
app.use(express.json());
app.use(cors());


mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

const authRoutes = require("./routes/auth");
app.use("/api/auth", authRoutes);

app.listen(5000, () => console.log("Server running on port 5000"));
