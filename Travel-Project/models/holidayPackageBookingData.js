const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const holidayPackageBookingDataSchema = new Schema({
  packageId: {
    type: String,
    required: true,
  },
  categoryId: {
    type: String,
    required: true,
  },
  userId: {
    type: String,
    required: true,
  },
  checkoutId: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  totalPersons: {
    type: Number,
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

const holidayPackageBookingDataModel = model(
  "holidayPackageBookingData",
  holidayPackageBookingDataSchema
);

module.exports = holidayPackageBookingDataModel;
