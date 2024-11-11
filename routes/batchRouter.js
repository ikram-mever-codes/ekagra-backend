import express from "express";
import {
  createBatch,
  getAllBatches,
  getBatchById,
  updateBatch,
  deleteBatch,
  getCourseBatches,
} from "../controller/batchController.js";

const router = express.Router();

router.post("/batches", createBatch);
router.get("/batches", getAllBatches);
router.get("/batches/:id", getBatchById);
router.put("/batches/:id", updateBatch);
router.delete("/batches/:id", deleteBatch);
router.get("/course/:courseId", getCourseBatches);

export default router;
