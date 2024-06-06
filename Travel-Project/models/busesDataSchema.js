const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const busesDataSchema = new Schema({
  busProviderName: {
    type: String,
    required: true,
  },
  categoryId: {
    type: String,
    required: true,
  },
  providerLogo: {
    type: String,
    required: true,
  },
  serviceNumber: {
    type: String,
    required: true,
  },
  departurePlace: {
    type: String,
    required: true,
  },
  destination: {
    type: String,
    required: true,
  },
  departureTime: {
    type: String,
    required: true,
  },
  arrivalTime: {
    type: String,
    required: true,
  },
  journeyDate: {
    type: Date,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  duration: {
    type: String,
    required: true,
  },
  seats: {
    type: String,
    required: true,
  },
});

const busesDataModel = model("busesData", busesDataSchema);

module.exports = busesDataModel;
