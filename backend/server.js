require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const Razorpay = require("razorpay");
const cors = require("cors");
const http = require("http");
const User = require("./models/User.js");
const Patient = require("./models/Patients.js");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" },
});

app.use(express.json());
app.use(cors());

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

const authRoutes = require("./routes/auth");
const packageRoutes = require("./routes/package");
const paymentRoutes = require("./routes/payment");

app.use("/api/auth", authRoutes);
app.use("/api/package", packageRoutes);
app.use("/api/payment", paymentRoutes);
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
// WebSocket Connection Handling
io.on("connection", (socket) => {
  console.log("A client connected:", socket.id);

  socket.on("get_requests", async (user) => {
    try {
      const tempUserData = await JSON.parse(user);
      const userData = await User.findById(tempUserData._id);
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
      const output = await getPaymentDetails(requests);
      socket.emit("requests_data", output);
    } catch (error) {
      socket.emit("error", { message: "Failed to fetch requests" });
    }
  });
  socket.on("disconnect", () => {
    console.log("A client disconnected:", socket.id);
  });
});

// Start server with WebSocket support
server.listen(5000, () => console.log("Server running on port 5000"));
