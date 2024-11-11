import User from "../models/userModel.js";
import ErrorHandler from "../utils/errorHandler.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (email === "" || password === "") {
      return next(
        new ErrorHandler("Missing credentials! Please try again.", 400)
      );
    }

    let user = await User.findOne({ email });
    if (!user) {
      return next(new ErrorHandler("Invalid email! Please try again.", 400));
    }
    if (user.isVerified === false) {
      return next(new ErrorHandler("Invalid Email! Please Try Again.", 401));
    }
    let passwordMatch = await bcryptjs.compare(password, user.password);
    if (!passwordMatch) {
      return next(
        new ErrorHandler("Incorrect Password! Please Try Again.", 401)
      );
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || "", {
      expiresIn: "7d",
    });

    return res
      .status(200)
      .cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })
      .json({
        message: `Welcome Back ${user.firstName}!`,
        user,
      });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
};

export const refresh = async (req, res, next) => {
  try {
    let token = req.cookies.token;
    if (!token || token === "") {
      return next(
        new ErrorHandler("Session not found! Please Login Again", 400)
      );
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user || !user.isVerified) {
      return next(new ErrorHandler("Invalid Session! Please Login Again", 400));
    }
    return res
      .status(200)
      .cookie("token", token, {
        httpOnly: true,
        secure: false,
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })
      .json({ user });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
};

export const logout = (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token || token === "") {
      return next(
        new ErrorHandler("Session not found! Please Login Again", 400)
      );
    }
    return res
      .status(200)
      .clearCookie("token", {
        httpOnly: true,
        secure: false,
        sameSite: "strict",
      })
      .json({ message: "Logged Out Successfully!" });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
};
