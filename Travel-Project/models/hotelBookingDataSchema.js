const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const hotelBookingDataSchema = new Schema({
  
  

  
 
  firstName: {
    type: String,
    required: true,
  },
  middleName: {
    type: String,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  totalPrice: {
    type: Number,
    required: true,
  },
  numberOfNights: {
    type: Number,
    required: true,
  },
  rooms: {
    type: Number,
    required: true,
  },
  passengers: {
    type: Number,
    required: true,
  },
  checkIn:{
    type: Date,
    required: true,
  },
  checkOut:{
    type: Date,
    required: true,
  },
  hotelId: {
    type: String,
    required: true,
  },
  userId:{
    type: String,
    required: true,
  },
 BookingNo:{
type:String,
required:true,
unique:true
 },
  


checkoutSessionId:{
  type: String,
  
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

const hotelBookingDataModel = model("hotelBookingData", hotelBookingDataSchema);

module.exports = hotelBookingDataModel;
