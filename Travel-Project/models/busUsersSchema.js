const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const busesUserSchema = new Schema({

  passengers: [
    {
      travellerName: {
        type: String,
        required: true,
      },
      gender: {
        type: String,
        required: true,
      },
     
      age: {
        type: String,
        required: true,
      },
    },
  ],
  
  contactPrefix: {
    type: String,
    required: true,
  },
  contactNo: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  
  seatNumbers: [
    {
      type: String,
    },
  ],
  busId: {
    type: String,
    required: true,
  },
  checkoutSessionId: {
    type: String,
  },
  userId: {
    type: String,
    required: true,
  },
  busDetails: {
    type: Object,
    required: true,
  },
  paymentStatus: {
    type: String,
    default: "pending",
  },
  barcodeUrl: {
    type: String,
  },
  journeyDate: {
    type: String,
    required: true,
  },
  boardingPoint: {
    type: String,
    required: true,
  },
  droppingPoint: {
    type: String,
    required: true,
  },
  ticketNumber: {
    type: String,
    required: true,
    unique: true,
  },
});

const busesUserModel = model("busesUserInfo", busesUserSchema);

module.exports = busesUserModel;
