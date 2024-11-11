import express from "express";
import {
  createCoupon,
  getAllCoupons,
  getCouponById,
  updateCoupon,
  deleteCoupon,
  applyCoupon,
} from "../controller/couponController.js";

const router = express.Router();

router.post("/create", createCoupon);

router.get("/", getAllCoupons);

router.get("/:id", getCouponById);

router.put("/:id", updateCoupon);

router.post("/apply", applyCoupon);

router.delete("/:id", deleteCoupon);

export default router;
