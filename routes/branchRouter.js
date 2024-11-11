import express from "express";
import {
  createBranch,
  getAllBranches,
  getBranchById,
  updateBranch,
  deleteBranch,
  getCityBranches,
} from "../controller/branchController.js";

const router = express.Router();

router.post("/branches", createBranch);

router.get("/branches", getAllBranches);

router.get("/branches/:id", getBranchById);

router.put("/branches/:id", updateBranch);

router.delete("/branches/:id", deleteBranch);

router.get("/city/:cityId", getCityBranches);

export default router;
