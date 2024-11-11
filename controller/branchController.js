import Branch from "../models/branchModel.js";
import ErrorHandler from "../utils/errorHandler.js";
export const createBranch = async (req, res, next) => {
  try {
    const { name, code, city } = req.body;
    if (!name || !code || !city.id | !city.name) {
      return next(new ErrorHandler("Incomplete Fields!", 400));
    }
    const existingBranch = await Branch.findOne({ code: code });
    if (existingBranch) {
      return res
        .status(400)
        .json({ message: "Branch with this code already exists." });
    }

    const branch = new Branch({
      name,
      code: code,
      city: {
        id: city.id,
        name: city.name,
      },
    });

    await branch.save();
    res.status(201).json({ message: "Branch created successfully.", branch });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error while creating branch." });
  }
};

export const getAllBranches = async (req, res) => {
  try {
    const branches = await Branch.find().populate("city.id", "name");
    res.status(200).json(branches);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error while fetching branches." });
  }
};

export const getBranchById = async (req, res) => {
  try {
    const branch = await Branch.findById(req.params.id).populate(
      "city.id",
      "name"
    );
    if (!branch) {
      return res.status(404).json({ message: "Branch not found." });
    }
    res.status(200).json(branch);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error while fetching branch." });
  }
};

export const updateBranch = async (req, res) => {
  try {
    const { name, code, city } = req.body;
    const branch = await Branch.findById(req.params.id);

    if (!branch) {
      return res.status(404).json({ message: "Branch not found." });
    }

    branch.name = name || branch.name;
    branch.code = code ? code.toLowerCase() : branch.code;
    branch.city = city || branch.city;

    await branch.save();
    res.status(200).json({ message: "Branch updated successfully.", branch });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error while updating branch." });
  }
};

export const deleteBranch = async (req, res) => {
  try {
    const branch = await Branch.findById(req.params.id);

    if (!branch) {
      return res.status(404).json({ message: "Branch not found." });
    }

    await Branch.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Branch deleted successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error while deleting branch." });
  }
};
export const getCityBranches = async (req, res, next) => {
  try {
    let { cityId } = req.params;

    let branches = await Branch.find({ "city.id": cityId });

    return res.status(200).json({
      branches,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
};
