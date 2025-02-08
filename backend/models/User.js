const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  email: { type: String, unique: true },
  password: String,
  name:{type:String},
  moblie:{type:String}
},{ timestamps: true });

module.exports = mongoose.model("User", UserSchema);