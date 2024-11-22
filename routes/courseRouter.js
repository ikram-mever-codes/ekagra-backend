import express from "express";
import {
  createCourse,
  getAllCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
  createPrepeartion,
  deletePrep,
  updatePrep,
  getPrep,
} from "../controller/courseController.js";
import isAuth from "../middlewares/isAuth.js";

const router = express.Router();

router.post("/courses", isAuth, createCourse);
router.get("/courses", getAllCourses);
router.get("/courses/:id", isAuth, getCourseById);
router.put("/courses/:id", isAuth, updateCourse);
router.delete("/courses/:id", isAuth, deleteCourse);
router.post("/prep", isAuth, createPrepeartion);
router.delete("/prep/:id", isAuth, deletePrep);
router.put("/prep", isAuth, updatePrep);
router.get("/prep", getPrep);

export default router;
