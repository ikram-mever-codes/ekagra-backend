import User from "../models/userModel.js";
import ErrorHandler from "../utils/errorHandler.js";

const isAuth = async (req, res, next) => {
  try {
    let token = req.cookies.token;
    if (!token || token === "") {
      return next(
        new ErrorHandler("Session Expired! Please login again.", 402)
      );
    }
    let decoded = jwt.verify(token, process.env.JWT_SECRET);

    let user = await User.findById(decoded.id);
    if (!user || !user.isVerified) {
      return next(
        new ErrorHandler("Invalid Session! Please Login Again.", 402)
      );
    }
    req.user = user;
    next();
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
};

export default isAuth;
