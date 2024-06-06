const mongoose = require('mongoose');

const flightSchema = new mongoose.Schema({
  airline: String,
  flightNumber: String,
  departureCity: String,
  arrivalCity: String,
  departureAirport: String,
  arrivalAirport: String,

  departureTerminal: String,
  arrivalTerminal: String,
  departureGate: String,
  arrivalGate: String,

  departureTime: Date,
  arrivalTime: Date,
  duration: Number,
  price: Number,
});

module.exports = mongoose.model('Flights', flightSchema);
