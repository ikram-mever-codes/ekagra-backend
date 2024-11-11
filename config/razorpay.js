import Razorpay from "razorpay";
import dotenv from "dotenv";
dotenv.config();

let razorpayService = new Razorpay({
  key_id: process.env.RAZORPAY_KEY,
  key_secret: process.env.RAZORPAY_SECRET,
});

export default razorpayService;
