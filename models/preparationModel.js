import mongoose from "mongoose";

const preparationSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
  },
  { timestamps: true }
);

const Preparation = mongoose.model("Preparation", preparationSchema);

export default Preparation;
