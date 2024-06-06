const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const busesReviewsSchema = new Schema({
  rating: {
    type: Number,
    required: true,
  },
  review: {
    type: String,
  },
  userId: {
    type: String,
    required: true,
  },
  reviewDate: {
    type: Date,
    required: true,
  },
  isReviewApproved: {
    type: String,
    required: true,
    default: "PENDING",
  },
});

const busesSearchSchema = new Schema({
  busName: {
    type: String,
    required: true,
  },
  fromDeparture: {
    type: String,
    required: true,
  },
  toDestination: {
    type: String,
    required: true,
  },
  fromDepartureTime: {
    type: String,
    required: true,
  },
  toArrivalTime: {
    type: String,
    required: true,
  },
  fare: {
    type: Number,
    required: true,
  },
  timeDuration: {
    type: String,
    required: true,
  },
  noOfSeats: {
    type: String,
    required: true,
  },
  classAC: {
    type: String,
  },
  distance: {
    type: String,
  },
  boardingPoints: [
    {
      type: String,
    },
  ],
  droppingPoints: [
    {
      type: String,
    },
  ],
  journeyDateRange: {
    startDate: Date,
    endDate: Date,
  },
  reviews: [busesReviewsSchema],
  categoryId: {
    type: String,
    default: "BUS",
    required: true,
  },
});

const busesSearchModel = model("busesInformation", busesSearchSchema);

module.exports = busesSearchModel;
