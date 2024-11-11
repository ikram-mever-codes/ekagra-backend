import mongoose from "mongoose";

const connectDb = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || "", { dbName: "Ekagra" });
    console.log("Database connected successfully :) ");
  } catch (error) {
    console.log(
      `DATABASE ERROR: Connection to Database Failed  || ${error.message}`
    );
    process.exit(1);
  }
};

export default connectDb;
