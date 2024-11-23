import razorpayService from "../config/razorpay.js";
import Admission from "../models/admissionModel.js";
import crypto from "crypto";
import ErrorHandler from "../utils/errorHandler.js";
import Payment from "../models/paymentModel.js";
import Course from "../models/courseModel.js";
import Coupon from "../models/couponMode.js";
import Batch from "../models/batchModel.js";
import Trash from "../models/TrashModel.js";

export const createOrder = async (req, res, next) => {
  const { courseId, referenceCode, couponCode } = req.body;

  let course = await Course.findById(courseId);
  if (!course) {
    return next(new ErrorHandler("Invalid Course! Try Later", 404));
  }
  let amount = course.price;

  if (referenceCode) {
    let coupon = await Coupon.findOne({ code: referenceCode });
    if (coupon && coupon.type === "referral") {
      let discount = coupon.discount;
      const discountAmount = (amount * discount) / 100;
      amount -= discountAmount;
      coupon.usageCount += 1;
      await coupon.save();
    }
  }

  if (couponCode) {
    let coupon = await Coupon.findOne({ code: couponCode });

    if (!coupon) {
      return next(new ErrorHandler("Invalid Coupon Code", 400));
    }

    const currentDate = new Date();
    if (coupon.start && currentDate < new Date(coupon.start)) {
      return next(new ErrorHandler("Coupon is not active yet", 400));
    }
    if (coupon.end && currentDate > new Date(coupon.end)) {
      return next(new ErrorHandler("Coupon has expired", 400));
    }

    let discount = coupon.discount;
    const discountAmount = (amount * discount) / 100;
    amount -= discountAmount;
    coupon.usageCount += 1;
    await coupon.save();
  }

  try {
    let orderAmount = Math.floor(amount * 100);
    const order = await razorpayService.orders.create({
      amount: orderAmount,
      currency: "INR",
      receipt: `receipt_${new Date().getTime()}`,
    });

    res.status(200).json({
      order,
      amount: order.amount,
      currency: order.currency,
    });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
export const paymentVerification = async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
    req.body;
  let { admData } = req.query;
  if (!admData) {
    return res.status(400).json({ message: "Missing admData in query" });
  }
  const stringData = decodeURIComponent(admData);
  let objData = JSON.parse(stringData);

  const body = razorpay_order_id + "|" + razorpay_payment_id;
  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_SECRET)
    .update(body.toString())
    .digest("hex");

  const isAuthentic = expectedSignature === razorpay_signature;
  let data = new Date(Date.now());
  let year = data.getFullYear();

  if (isAuthentic) {
    const payment = await Payment.create({
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      amount: admData.amount,
    });
    const studentCode = await generateStudentCode(
      year,
      objData.city.code,
      objData.branch.code,
      objData.branch.id
    );
    await Admission.create({
      ...objData,
      amount: objData.amount,
      address: {
        addressLine1: objData.addressLine1,
        addressLine2: objData.addressLine2,
        city: objData.cityName,
        pincode: objData.pincode,
      },
      source: objData.howDidYouKnow,
      cityName: objData.cityName,
      mobileNumber: objData.mobileNumber,
      studentCode: studentCode,
      payment: {
        id: payment._id,
        status: "successfull",
        date: new Date(Date.now()),
      },
    });
    let batch = await Batch.findById(objData.batch.id);
    batch.availableSeats = batch.availableSeats - 1;
    await batch.save();
    res.redirect(
      `${process.env.FRONTEND_URL}/admission-form?step=3&studentCode=${studentCode}`
    );
  } else {
    res.status(400).json({
      success: false,
    });
  }
};
export const deleteAdm = async (req, res, next) => {
  try {
    const { id } = req.params;

    const adm = await Admission.findById(id);
    if (!adm) {
      return next(new ErrorHandler("Admission not Found!", 404));
    }
    const trashData = {
      fullName: adm.fullName,
      fatherName: adm.fatherName,
      mobileNumber: adm.mobileNumber,
      dob: adm.dob,
      gender: adm.gender,
      source: adm.source,
      email: adm.email,
      cityName: adm.cityName,
      bloodGroup: adm.bloodGroup,
      photo: adm.photo,
      aadharFront: adm.aadharFront,
      preparation: adm.preparation,
      amount: adm.amount,
      studentCode: adm.studentCode,
      paymentStatus: adm.payment.status,
      paymentDate: adm.payment.date,
      city: adm.city,
      branch: adm.branch, // Same for branch
      course: adm.course, // Same for course
      batch: adm.batch, // Same for batch
      address: adm.address,
      createdAt: adm.createdAt,
      updatedAt: adm.updatedAt,
    };

    let trash = new Trash(trashData);
    await trash.save();

    await Admission.findByIdAndDelete(id);

    return res.status(200).json({ message: "Admission Deleted Successfully!" });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
};

export const getAllAdms = async (req, res, next) => {
  try {
    const adms = await Admission.find({});
    return res.status(200).json({ adms: adms.reverse() });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
};

export const viewSingleAdmin = async (req, res, next) => {
  try {
    const { admId } = req.params;
    const adm = await Admission.findById(admId);
    if (!adm) {
      return next(new ErrorHandler("Admission Not Found", 404));
    }
    return res.status(200).json({
      adm,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
};

export const getReports = async (req, res, next) => {
  try {
    const admissions = await Admission.find({});
    const coupons = await Coupon.find({});

    return res.status(200).json({ admissions, coupons });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
};

async function generateStudentCode(year, cityCode, branchCode, branchId) {
  const shortYear = String(year).slice(-2);

  const lastAdmission = await Admission.findOne({
    "branch.code": branchCode,
    "branch.id": branchId,
  })
    .sort({ createdAt: -1 })
    .select("studentCode");

  let applicationNumber;

  if (lastAdmission) {
    const lastApplicationNumber = parseInt(
      lastAdmission.studentCode.split("-").pop(),
      10
    );

    applicationNumber = isNaN(lastApplicationNumber)
      ? 1
      : lastApplicationNumber + 1;
  } else {
    // Start at 1 if there are no previous admissions for this branch
    applicationNumber = 1;
  }

  // Format the application number as a 4-digit string
  const formattedApplicationNumber = String(applicationNumber).padStart(4, "0");

  // Construct and return the student code
  return `${shortYear}-${cityCode}-${branchCode}-${formattedApplicationNumber}`;
}
