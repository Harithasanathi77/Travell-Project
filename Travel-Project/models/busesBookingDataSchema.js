const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const busBookingDataSchema = new Schema({
  journeyId: {
    type: String,
    required: true,
  },
  userId: {
    type: String,
    required: true,
  },
  categoryId: {
    type: String,
    required: true,
  },
  seats: {
    type: String,
  },
  totalPassengers: {
    type: Number,
    required: true,
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
});

const busBookingDataModel = model(
  "busBookingData",
  busBookingDataSchema
);

module.exports = busBookingDataModel;
