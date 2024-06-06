const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const trainBookingDataSchema = new Schema({

  UserName: {
    type: String,
    required: true,
  },
  Gender: {
    type: String,
    
  },
  Age: {
    type: String,
    // required: true,
  },
  contactNo: {
    type: String,
    // required: true,
  },
  contactEmail: {
    type: String,
    // required: true,
  },

  journeyId: {
    type: String,
    // required: true,
  },

  BordingPoint: {
    type: String,
    // required: true,
  },
  userId: {
    type: String,
    // required: true,
  },
  categoryId: {
    type: String,
    // required: true,
  },
  seats: {
    type: String,
  },
  totalPassengers: {
    type: Number,
    // required: true,
  },
  price: {
    type: String,
    // required: true,
  },
  checkoutId: {
    type: String,
    // required: true,
  },
  paymentStatus: {
    type: String,
    // required: true,
    default: "initial",
  },
  barcodeUrl: {
    type: String,
  },
});

const trainBookingDataModel = model("trainBookingData", trainBookingDataSchema);

module.exports = trainBookingDataModel;
