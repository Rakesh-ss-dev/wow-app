const cron = require("node-cron");
const syncRazorpayToPatients = require("./cron/syncRazorpayPatients");
console.log("Rakesh");
cron.schedule("*/15 * * * *", () => {
    try{
  console.log("🕒 Running Razorpay sync cron...");
  syncRazorpayToPatients();
}catch(err){
    console.log(err);
}
});