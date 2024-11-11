import City from "../models/cityModel.js";
import ErrorHandler from "../utils/errorHandler.js";

export const createCity = async (req, res, next) => {
  try {
    const { name, code } = req.body;

    if (!name || !code) {
      return next(new ErrorHandler("City name and code are required.", 400));
    }

    const cityExists = await City.findOne({ code });
    if (cityExists) {
      return next(new ErrorHandler("City code must be unique.", 400));
    }

    await City.create({ name, code });
    const cities = await City.find({});
    return res.status(201).json({
      message: "City created successfully.",
      cities,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
};

export const getAllCities = async (req, res, next) => {
  try {
    const cities = await City.find().sort({ createdAt: -1 });

    if (!cities || cities.length === 0) {
      return next(new ErrorHandler("No cities found.", 404));
    }

    return res.status(200).json({
      cities,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
};

export const getCityById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const city = await City.findById(id);
    if (!city) {
      return next(new ErrorHandler("City not found.", 404));
    }

    return res.status(200).json({
      message: "City fetched successfully.",
      city,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
};

export const updateCity = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, code } = req.body;

    if (!name || !code) {
      return next(new ErrorHandler("City name and code are required.", 400));
    }

    const updatedCity = await City.findByIdAndUpdate(
      id,
      { name, code },
      { new: true, runValidators: true }
    );

    if (!updatedCity) {
      return next(new ErrorHandler("City not found.", 404));
    }

    return res.status(200).json({
      message: "City updated successfully.",
      city: updatedCity,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
};

export const deleteCity = async (req, res, next) => {
  try {
    const { id } = req.params;

    const city = await City.findByIdAndDelete(id);
    if (!city) {
      return next(new ErrorHandler("City not found.", 404));
    }

    return res.status(200).json({
      message: "City Deleted Successfully.",
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
};
