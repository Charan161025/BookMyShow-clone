require("dotenv").config();

const Booking = require("../models/bookingSchema");
const Show = require("../models/showSchema");
const emailHelper = require("../utils/emailHelper");
const Razorpay = require("razorpay");
const crypto = require("crypto");


const makePayment = async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount) {
      return res.status(400).send({
        success: false,
        message: "Amount is required (in paise)",
      });
    }

    
    const razorpayInstance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    
    const options = {
      amount: amount, 
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };

    const order = await razorpayInstance.orders.create(options);

    return res.send({
      success: true,
      message: "Order created successfully",
      data: {
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        keyId: process.env.RAZORPAY_KEY_ID,
      },
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: error.message || "Razorpay Order Error",
    });
  }
};


const bookShow = async (req, res, next) => {
  try {
    const {
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature,
      show,
      user,
      seats,
    } = req.body;

    
    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(sign.toString())
      .digest("hex");

    if (razorpay_signature !== expectedSign) {
      return res.status(400).send({
        success: false,
        message: "Invalid payment signature. Transaction not verified!",
      });
    }

   
    const newBooking = new Booking({
      show,
      user,
      seats,
      transactionId: razorpay_payment_id,
      razorpayOrderId: razorpay_order_id,
      razorpaySignature: razorpay_signature,
    });

    await newBooking.save();

    
    const showDetails = await Show.findById(show);
    const updatedBookedSeats = [...showDetails.bookedSeats, ...seats];

    await Show.findByIdAndUpdate(show, {
      bookedSeats: updatedBookedSeats,
    });

    
    const populatedBooking = await Booking.findById(newBooking._id)
      .populate({ path: "user", select: "-password" })
      .populate({
        path: "show",
        populate: [
          { path: "theatre", model: "theatres" },
          { path: "movie", model: "movies" },
        ],
      });

    const metaData = {
      name: populatedBooking.user.name,
      movie: populatedBooking.show.movie.movieName,
      theatre: populatedBooking.show.theatre.name,
      date: populatedBooking.show.date,
      time: populatedBooking.show.time,
      seats: populatedBooking.seats,
      amount: populatedBooking.seats.length * populatedBooking.show.ticketPrice,
      transactionId: razorpay_payment_id,
    };

     
    await emailHelper("ticketTemplate.html", populatedBooking.user.email, metaData);

    
    return res.send({
      success: true,
      message: "Booking Successful",
      data: newBooking,
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: error.message,
    });
  }
};


const getAllBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find({ user: req.body.userId })
      .populate({ path: "user", select: "-password" })
      .populate({
        path: "show",
        populate: [
          { path: "movie", model: "movies" },
          { path: "theatre", model: "theatres" },
        ],
      });

    res.send({
      success: true,
      message: "Bookings Fetched",
      data: bookings,
    });
  } catch (error) {
    res.status(400).send({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  makePayment,
  bookShow,
  getAllBookings,
};