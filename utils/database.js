import mongoose from "mongoose";

const connectDb = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || "", {
      dbName: "Ekagra",
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 45000,
    });
    console.log("Database connected successfully :) ");
  } catch (error) {
    console.log(
      `DATABASE ERROR: Connection to Database Failed  || ${error.message}`
    );
    process.exit(1);
  }
};

export default connectDb;
