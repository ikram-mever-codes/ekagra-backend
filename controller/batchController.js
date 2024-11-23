import Batch from "../models/batchModel.js";
import ErrorHandler from "../utils/errorHandler.js";

// Create Batch
export const createBatch = async (req, res, next) => {
  try {
    const { name, course, totalSeats } = req.body;

    if (!name || !course || !totalSeats) {
      return next(
        new ErrorHandler(
          "Batch name, course, and total seats are required.",
          400
        )
      );
    }

    const batchExists = await Batch.findOne({ name, course: course.id });
    if (batchExists) {
      return next(
        new ErrorHandler("This batch already exists for the given course.", 400)
      );
    }

    const newBatch = await Batch.create({
      name,
      course,
      totalSeats,
      availableSeats: totalSeats,
    });

    return res.status(201).json({
      message: "Batch created successfully.",
      batch: newBatch,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
};

// Get All Batches
export const getAllBatches = async (req, res, next) => {
  try {
    const batches = await Batch.find().sort({ createdAt: -1 });

    if (!batches || batches.length === 0) {
      return next(new ErrorHandler("No batches found.", 404));
    }

    return res.status(200).json({
      batches,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
};

// Get Batch by ID
export const getBatchById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const batch = await Batch.findById(id);
    if (!batch) {
      return next(new ErrorHandler("Batch not found.", 404));
    }

    return res.status(200).json({
      message: "Batch fetched successfully.",
      batch,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
};

// Update Batch
export const updateBatch = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, course, totalSeats } = req.body;

    if (!name || !course || !totalSeats) {
      return next(
        new ErrorHandler(
          "Batch name, course, and total seats are required.",
          400
        )
      );
    }

    const updatedBatch = await Batch.findByIdAndUpdate(
      id,
      { name, course, totalSeats, availableSeats: totalSeats },
      { new: true, runValidators: true }
    );

    if (!updatedBatch) {
      return next(new ErrorHandler("Batch not found.", 404));
    }

    return res.status(200).json({
      message: "Batch updated successfully.",
      batch: updatedBatch,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
};

// Delete Batch
export const deleteBatch = async (req, res, next) => {
  try {
    const { id } = req.params;

    const batch = await Batch.findByIdAndDelete(id);
    if (!batch) {
      return next(new ErrorHandler("Batch not found.", 404));
    }

    return res.status(200).json({
      message: "Batch deleted successfully.",
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
};

export const getCourseBatches = async (req, res, next) => {
  try {
    let { courseId } = req.params;

    let batches = await Batch.find({ "course.id": courseId });
    return res.status(200).json({
      batches,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
};
