import mongoose from "mongoose";

const batchSchema = new mongoose.Schema(
  {
    name: { type: String },
    course: {
      id: { type: mongoose.Schema.Types.ObjectId },
      name: { type: String },
    },
    totalSeats: {
      type: Number,
      required: true,
    },
    availableSeats: {
      type: Number,
      default: function () {
        return this.totalSeats;
      },
    },
  },
  { timestamps: true }
);

const Batch = mongoose.model("Batch", batchSchema);

export default Batch;
