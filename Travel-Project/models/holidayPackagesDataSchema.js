const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const holidayPackagesDataSchema = new Schema({
  providerName: {
    type: String,
  },
  categoryId: {
    type: String,
  },
  providerLogo: {
    type: String,
  },
  departureCity: {
    type: String,
  },
  returnTime: {
    type: String,
  },
  returnDate: {
    type: Date,
  },

  //above fields not using
  mainImage: {
    type: String,
  },
  packageName: {
    type: String,
  },
  price: {
    type: Number,
  },
  journeyDate: {
    type: Date,
  },
  departureTime: {
    type: String,
  },
  noOfGroup: {
    type: String,
  },
  duration: {
    type: String,
  },
  departureArrivingAreas: {
    type: String,
  },
  guideService: {
    type: String,
  },
  language: {
    type: String,
  },
  entryFees: {
    type: String,
  },
  entryTransportation: {
    type: String,
  },
});

const holidayPackagesDataModel = model(
  "holidayPackagesData",
  holidayPackagesDataSchema
);

module.exports = holidayPackagesDataModel;
