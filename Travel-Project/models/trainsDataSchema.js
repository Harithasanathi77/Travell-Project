const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const trainsDataSchema = new Schema({
  // trainName: {
  //   type: String,
  //   required: true,
  // },
  // serviceLogo: {
  //   type: String,
  //   required: true,
  // },
  // serviceNumber: {
  //   type: String,
  //   required: true,
  // },
  // departurePlace: {
  //   type: String,
  //   required: true,
  // },
  // destination: {
  //   type: String,
  //   required: true,
  // },
  // departureTime: {
  //   type: String,
  //   required: true,
  // },
  // arrivalTime: {
  //   type: String,
  //   required: true,
  // },
  // journeyDate: {
  //   type: Date,
  //   required: true,
  // },
  // price: {
  //   type: Number,
  //   required: true,
  // },
  // duration: {
  //   type: String,
  //   required: true,
  // },
  // coachId: {
  //   type: String,
  //   required: true,
  // },
  // avilable:{
  //   type:String
  // },
  // categoryId: {
  //   type: String,
  //   required: true,
  // },

    trainName: {
    type: String,
    required: true,
  },
  trainnumber: {
    type: String,
    required: true,
  },
  departureTime: {
    type: String,
    required: true,
  },
  journeyDate: {
    type: Date,
    required: true,
  },
  arrivalTime: {
    type: String,
    required: true,
  },
  source: {
    type: String,
    required: true,
  },
  destination: {
    type: String,
    required: true,
  },
  arrivalStationCode: {
    type: String,
    required: true,
  },
  departureStationCode: {
    type: String,
    required: true,
  },
  price1: {
    type: String,
    required: true,
  },
  class1: {
    type: String,
    required: true,
  },
  price2: {
    type: String,
    required: true,
  },
  class2: {
    type: String,
    required: true,
  },
  price3: {
    type: String,
    required: true,
  },
  class3: {
    type: String,
    required: true,
  },
  price4: {
    type: String,
    required: true,
  },
  class4: {
    type: String,
    required: true,
  },
  price5: {
    type: String,
    required: true,
  },
  class5: {
    type: String,
    required: true,
  },
  price6: {
    type: String,
    required: true,
  },
  class6: {
    type: String,
    required: true,
  },
  available: {
    type: String,
    required: true,
  },
  quota1: {
    type: String,
    required: true,
  },
  quota2: {
    type: String,
    required: true,
  },
  quota3: {
    type: String,
    required: true,
  }


});

const trainsDataModel = model("trainsData", trainsDataSchema);

module.exports = trainsDataModel;
