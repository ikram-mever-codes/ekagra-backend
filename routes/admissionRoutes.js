import express from "express";
import {
  createOrder,
  deleteAdm,
  getAllAdms,
  getReports,
  paymentVerification,
  viewSingleAdmin,
} from "../controller/admissionController.js";

const router = express.Router();

router.post("/create-order", createOrder);
router.post("/payment-verification", paymentVerification);
router.get("/all", getAllAdms);
router.get("/:admId", viewSingleAdmin);
router.delete("/:id", deleteAdm);
router.get("/admin/reports", getReports);
export default router;
