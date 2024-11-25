import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import errorMiddleware from "./middlewares/errorMiddleware.js";
import cookieParser from "cookie-parser";
import connectDb from "./utils/database.js";
import userRouter from "./routes/userRouter.js";
import couponRouter from "./routes/couponRouter.js";
import cityRouter from "./routes/cityRouter.js";
import branchRouter from "./routes/branchRouter.js";
import batchRouter from "./routes/batchRouter.js";
import courseRouter from "./routes/courseRouter.js";
import admRouter from "./routes/admissionRoutes.js";
import upload from "./config/multer.js";
import path from "path";

dotenv.config();

const app = express();
const __uploads_dirname = path.resolve();

app.use("/images", express.static(path.join(__uploads_dirname, "images")));

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
    "Access-Control-Allow-Origin": process.env.FRONTEND_URL,
  })
);
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));
app.use(cookieParser());

app.use("/api/v1/user", userRouter);
app.use("/api/v1/city", cityRouter);
app.use("/api/v1/batch", batchRouter);
app.use("/api/v1/branch", branchRouter);
app.use("/api/v1/coupon", couponRouter);
app.use("/api/v1/course", courseRouter);
app.use("/api/v1/adm", admRouter);

// Upload route
app.post("/api/v1/upload", (req, res) => {
  upload(req, res, (err) => {
    if (err) {
      return res.status(400).json({
        error: err.message,
      });
    }

    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded." });
    }

    const fileUrl = `https://api.ekagra.in/images/${req.file.filename}`;
    res.json({
      message: "File uploaded successfully!",
      url: fileUrl,
    });
  });
});

app.use(errorMiddleware);

app.get("/", (req, res, next) => {
  res.send("Hello World...");
});

app.get("/api/v1/getkey", (req, res) => {
  return res.status(200).json({ key: process.env.RAZORPAY_KEY });
});

app.get("*", (req, res, next) => {
  return res.status(404).json({ message: "Resource Not Found." });
});

const PORT = process.env.PORT || 6001;

connectDb();

app.listen(PORT, () => {
  console.log(`Server is running on PORT ${PORT}`);
});
