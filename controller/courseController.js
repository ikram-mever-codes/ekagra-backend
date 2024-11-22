import Course from "../models/courseModel.js";
import Preparation from "../models/preparationModel.js";
import ErrorHandler from "../utils/errorHandler.js";

// Create a new course
export const createCourse = async (req, res, next) => {
  try {
    const { name, description, price, perparation } = req.body;

    if (!name || !description || !price || !perparation.id) {
      return next(new ErrorHandler("All fields are required", 400));
    }

    const newCourse = await Course.create({
      name,
      description,
      price,
      preparation: {
        id: perparation.id,
        name: perparation.name,
      },
    });
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
    const { field } = req.query;
    let courses;
    if (field) {
      courses = await Course.find({
        "preparation.name": field.toString(),
      }).sort({
        createdAt: -1,
      });
    } else {
      courses = await Course.find().sort({
        createdAt: -1,
      });
    }
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

export const createPrepeartion = async (req, res, next) => {
  try {
    const { name } = req.body;
    if (!name) {
      return next(new ErrorHandler("Name is required!", 400));
    }
    const prep = new Preparation({ name: name });
    await prep.save();
    return res
      .status(201)
      .json({ message: "Preparation Field added successfully!" });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
};

export const deletePrep = async (req, res, next) => {
  try {
    const { id } = req.params;
    let prep = await Preparation.findById(id);

    if (!prep) {
      return next(new ErrorHandler("Preparation Field not found!", 404));
    }

    await Preparation.findByIdAndDelete(id);

    return res
      .status(200)
      .json({ message: "Preparation Field deleted successfully!" });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
};

export const updatePrep = async (req, res, next) => {
  try {
    const { preparationId, name } = req.body;

    let prep = await Preparation.findById(preparationId);
    if (!prep) {
      return next(new ErrorHandler("Preparation Field not found!", 404));
    }

    prep.name = name || prep.name;
    await prep.save();
    return res
      .status(200)
      .json({ message: "Preparation Field Updated successfully!" });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
};

export const getPrep = async (req, res, next) => {
  try {
    let prep = await Preparation.find({});
    if (prep.length === 0) {
      return next(new ErrorHandler("No Preparation Fields found!", 404));
    }
    return res.status(200).json({ prep });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
};
