import mongoose from "mongoose";

const couponSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    code: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    type: {
      type: String,
      enum: ["public", "private", "referral"],
      required: true,
    },
    discount: { type: Number, max: 100, required: true },
    start: { type: Date, default: Date.now },
    end: { type: Date, required: true },
    usageCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Coupon = mongoose.model("Coupon", couponSchema);

export default Coupon;
