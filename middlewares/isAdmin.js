import ErrorHandler from "../utils/errorHandler.js";

const isAdmin = async (req, res, next) => {
  try {
    let user = req.user;
    if (!user) {
      return next(new ErrorHandler("Session Expired! Please login again", 402));
    }

    if (user.role !== "admin") {
      return next(
        new ErrorHandler(
          `Role : ${user.role} is not allowed to acccess this resource`,
          402
        )
      );
    }

    next();
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
};

export default isAdmin;
