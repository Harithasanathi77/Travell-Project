const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const departureAirportSchema = new Schema({
  type: {
    type: String,
    required: true,
    default: "AIRPORT",
  },
  code: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  cityName: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
  countryName: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
});

const arrivalAirportSchema = new Schema({
  type: {
    type: String,
    required: true,
    default: "AIRPORT",
  },
  code: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  cityName: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
  countryName: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
});

const carrierInfoSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  code: {
    type: String,
    required: true,
  },
  logo: {
    type: String,
    required: true,
  },
});

const facilitiesSchema = new Schema({
  facilityId: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
});

const flightStopsInfo = new Schema({
  stopDestinationInfo: arrivalAirportSchema,
  arrivalTime: {
    type: Date,
    required: true,
  },
  departureTime: {
    type: Date,
    required: true,
  },
});

const pricesSchema = new Schema({
  cabinClassId: {
    type: String,
    required: true,
  },
  forAdult: {
    type: Number,
    required: true,
  },
  forChildren: {
    type: Number,
    required: true,
  },
  forInfant: {
    type: Number,
    required: true,
  },
});

const ratingsSchema = new Schema({
  rating: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
  },
  userId: {
    type: String,
    required: true,
  },
  userName: {
    type: String,
  },
});

const flightsDataSchema = new Schema({
  departureTime: {
    type: Date,
    required: true,
  },
  arrivalTime: {
    type: Date,
    required: true,
  },
  categoryId: {
    type: String,
    required: true,
  },
  currencyCode: {
    type: String,
  },
  departureDay: {
    type: String,
    required: true,
  },
  departureAirport: departureAirportSchema,
  arrivalAirport: arrivalAirportSchema,
  cabinClass: [
    {
      typeId: {
        type: String,
        required: true,
      },
      typeName: {
        type: String,
        required: true,
      },
    },
  ],
  facilities: [facilitiesSchema],
  flightNumber: {
    type: Number,
  },
  planeType: {
    type: String,
  },
  carrierInfo: carrierInfoSchema,
  duration: {
    type: Number,
    required: true,
  },
  flightStops: [flightStopsInfo],
  prices: [pricesSchema],
  totalNumberOfSeats: [
    {
      cabinClassId: {
        type: String,
        required: true,
      },
      numberOfSeats: {
        type: Number,
        required: true,
      },
    },
  ],
  numberOfAvailableSeats: [
    {
      cabinClassId: {
        type: String,
        required: true,
      },
      availableSeats: {
        type: Number,
        required: true,
      },
    },
  ],
  baggage: [
    {
      type: {
        type: String,
        required: true,
      },
      luggageType: {
        type: String,
        required: true,
      },
      maxPiece: {
        type: Number,
        required: true,
      },
      maxWeightPerPiece: {
        type: Number,
        required: true,
      },
      massUnit: {
        type: String,
      },
      maxLength: {
        type: Number,
      },
      maxWidth: {
        type: Number,
      },
      maxHeight: {
        type: Number,
      },
      sizeUnit: {
        type: String,
      },
    },
  ],
  ratings: [ratingsSchema],
  discount: {
    type: Number,
    required: true,
  },
});

const flightsDataModel = model("flightsData", flightsDataSchema);

module.exports = flightsDataModel;
