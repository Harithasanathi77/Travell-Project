const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const holidayPackageTicketDataSchema = new Schema({
    userId: {
        type: String,
        required: true,
    },
    packageId: {
        type: String,
        required: true,
    },
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
    adultCount: {
        type: String,
    },
    childCount: {
        type: String,
    },
    infantCount: {
        type: String,
    },
    totalAdultPrice: {
        type: String,
    },
    totalChildPrice: {
        type: String,
    },
    totalPrice: {
        type: String,
    },
    ticketsToSend: {
        ticketsToName: { type: String, },
        ticketsToSurname: { type: String, },
        ticketsToMobileNumber: { type: String, },
        ticketsToEmail: { type: String, },
    },
    isPayment: {
        type: Boolean,
        required: true,
    },

});

const holidayPackageTicketModel = model(
    "holidayPackageTicketData",
    holidayPackageTicketDataSchema
);

module.exports = holidayPackageTicketModel;
