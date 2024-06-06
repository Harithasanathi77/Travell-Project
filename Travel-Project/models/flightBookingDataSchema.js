const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const passengersBookingDetailsDataSchema = new Schema({
  fullName: {
    type: String,
    // required: true,
  },
  email: {
    type: String,
    // required: true,
  },
  phoneNumber: {
    type: String,
    // required: true,
  },
  age: {
    type: String,
    // required: true,
  },
});

const flightBookingDataSchema = new Schema({
  journeyInfo: {
    type: String,
    // required: true,
  },
  userId: {
    type: String,
    required: true,
  },
  categoryId: {
    type: String,
    // required: true,
  },
  seats: {
    type: String,
  },
  totalPassengers: {
    adults: {
      type: Number,
    },
    children: {
      type: Number,
    },
    infants: {
      type: Number,
    },
  },
  // passengersDetails: [passengersBookingDetailsDataSchema],
  passengersDetails: {
    name: {
      type: String,
      // required: true,
    },
    email: {
      type: String,
      // required: true,
    },
    phoneNumber: {
      type: String,
      // required: true,
    },
  },
  price: {
    type: Number,
    required: true,
  },
  checkoutId: {
    type: String,
    required: true,
  },
  paymentStatus: {
    type: String,
    required: true,
    default: "initial",
  },
  barcodeUrl: {
    type: String,
  },
  ticketPdfUrl: {
    type: String,
  },
});

const flightBookingDataModel = model(
  "flightBookingData",
  flightBookingDataSchema
);

module.exports = flightBookingDataModel;
