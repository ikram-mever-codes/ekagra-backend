import mongoose from "mongoose";

const amissionSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    fatherName: {
      type: String,
      required: true,
    },
    mobileNumber: {
      type: String,
      required: true,
    },
    dob: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      required: true,
      enum: ["Male", "Female"],
    },
    source: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    whatsappNumber: {
      type: String,
    },
    address: {
      pincode: { type: String, required: true, minLength: 6, maxLength: 6 },
      addressLine1: {
        type: String,
      },
      addressLine2: {
        type: String,
      },
      city: { type: String, required: true },
    },
    state: {
      type: String,
      required: true,
    },
    cityName: {
      type: String,
      required: true,
    },
    bloodGroup: {
      type: String,
      required: true,
    },
    photo: {
      type: String,
      required: true,
    },
    aadharFront: {
      type: String,
      required: true,
    },

    aadharBack: {
      type: String,
      required: true,
    },
    preparation: {
      type: String,
      required: true,
    },
    city: {
      id: { type: mongoose.Schema.Types.ObjectId, required: true },
      name: { type: String, required: true },
      code: { type: String, required: true },
    },
    branch: {
      id: { type: mongoose.Schema.Types.ObjectId, required: true },
      name: { type: String, required: true },
      code: { type: String, required: true },
    },
    course: {
      id: { type: mongoose.Schema.Types.ObjectId, required: true },
      name: { type: String, required: true },
    },

    batch: {
      id: { type: mongoose.Schema.Types.ObjectId, required: true },
      name: { type: String, required: true },
    },
    amount: { type: String, required: true },
    studentCode: { type: String, required: true },
    payment: {
      id: { type: String, required: true },
      status: {
        type: String,
        default: "pending",
        enum: ["successful", "pending", "failed"],
      },
      date: {
        type: Date,
        required: true,
      },
    },
  },
  { timestamps: true }
);

const Admission = mongoose.model("Admission", amissionSchema);

export default Admission;
