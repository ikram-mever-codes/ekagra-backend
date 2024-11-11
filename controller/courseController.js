import Course from "../models/courseModel.js";
import ErrorHandler from "../utils/errorHandler.js";

// Create a new course
export const createCourse = async (req, res, next) => {
  try {
    const { name, description, price } = req.body;
    if (!name || !description || !price) {
      return next(new ErrorHandler("All fields are required", 400));
    }

    const newCourse = await Course.create({ name, description, price });
    return res.status(201).json({
      message: "Course created successfully.",
      course: newCourse,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
};

// Get all courses
export const getAllCourses = async (req, res, next) => {
  try {
    const courses = await Course.find().sort({ createdAt: -1 });
    if (!courses || courses.length === 0) {
      return next(new ErrorHandler("No courses found", 404));
    }

    return res.status(200).json({
      message: "Courses fetched successfully",
      courses,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
};

// Get a single course by ID
export const getCourseById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const course = await Course.findById(id);
    if (!course) {
      return next(new ErrorHandler("Course not found", 404));
    }

    return res.status(200).json({
      message: "Course fetched successfully",
      course,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
};

// Update a course
export const updateCourse = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, description, price } = req.body;

    if (!name || !description || !price) {
      return next(new ErrorHandler("All fields are required", 400));
    }

    const updatedCourse = await Course.findByIdAndUpdate(
      id,
      { name, description, price },
      { new: true, runValidators: true }
    );

    if (!updatedCourse) {
      return next(new ErrorHandler("Course not found", 404));
    }

    return res.status(200).json({
      message: "Course updated successfully",
      course: updatedCourse,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
};

// Delete a course
export const deleteCourse = async (req, res, next) => {
  try {
    const { id } = req.params;

    const course = await Course.findByIdAndDelete(id);
    if (!course) {
      return next(new ErrorHandler("Course not found", 404));
    }

    return res.status(200).json({
      message: "Course deleted successfully",
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
};
