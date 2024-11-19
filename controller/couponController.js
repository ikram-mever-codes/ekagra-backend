import Coupon from "../models/couponMode.js";
import ErrorHandler from "../utils/errorHandler.js";

// Create a new coupon
export const createCoupon = async (req, res, next) => {
  try {
    const { name, code, type, discount, start, end } = req.body;

    if (!name || !code || !type || discount === undefined || !end) {
      return next(new ErrorHandler("All fields are required.", 400));
    }

    const couponExists = await Coupon.findOne({ code });
    if (couponExists) {
      return next(new ErrorHandler("Coupon code must be unique.", 400));
    }

    const newCoupon = await Coupon.create({
      name,
      code,
      type,
      discount,
      start,
      end,
    });
    return res.status(201).json({
      message: "Coupon created successfully.",
      coupon: newCoupon,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
};
export const getAllCoupons = async (req, res, next) => {
  try {
    let { type, expired } = req.query;
    let coupons;

    if (!type || type === "undefined") {
      coupons = await Coupon.find({}).sort({ createdAt: -1 });
    } else {
      coupons = await Coupon.find({ type }).sort({ createdAt: -1 });
    }

    if (!coupons || coupons.length === 0) {
      return next(new ErrorHandler("No coupons found.", 404));
    }

    if (expired === "true") {
      const currentDate = new Date();
      coupons = coupons.filter((coupon) => new Date(coupon.end) >= currentDate);
    }
    if (coupons.length === 0) {
      return next(
        new ErrorHandler("No coupons found for the given criteria.", 404)
      );
    }

    return res.status(200).json({ coupons });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
};

// Get a single coupon by ID
export const getCouponById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const coupon = await Coupon.findById(id);

    if (!coupon) {
      return next(new ErrorHandler("Coupon not found.", 404));
    }

    return res.status(200).json({
      message: "Coupon fetched successfully.",
      coupon,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
};

// Update a coupon
export const updateCoupon = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, code, type, discount, start, end } = req.body;

    if (!name || !code || !type || discount === undefined || !end) {
      return next(new ErrorHandler("All fields are required.", 400));
    }

    const updatedCoupon = await Coupon.findByIdAndUpdate(
      id,
      { name, code, type, discount, start, end },
      { new: true, runValidators: true }
    );

    if (!updatedCoupon) {
      return next(new ErrorHandler("Coupon not found.", 404));
    }

    return res.status(200).json({
      message: "Coupon updated successfully.",
      coupon: updatedCoupon,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
};

// Delete a coupon
export const deleteCoupon = async (req, res, next) => {
  try {
    const { id } = req.params;

    const coupon = await Coupon.findByIdAndDelete(id);
    if (!coupon) {
      return next(new ErrorHandler("Coupon not found.", 404));
    }

    return res.status(200).json({
      message: "Coupon deleted successfully.",
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
};

export const applyCoupon = async (req, res, next) => {
  try {
    const { code, type } = req.body;
    let coupon;

    if (!code) {
      return next(new ErrorHandler("Code is Required!", 400));
    }
    coupon = await Coupon.findOne({ code });
    if (type && type !== "referral") {
      return next(new ErrorHandler("Invalid Coupon! Please Try Again", 404));
    }

    coupon.usage = coupon.usage + 1;
    await coupon.save();
    return res.status(200).json({
      discount: coupon.discount,
      start: coupon.start,
      end: coupon.end,
      type: coupon.type,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
};
