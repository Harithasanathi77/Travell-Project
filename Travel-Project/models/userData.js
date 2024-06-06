const mongoose = require('mongoose')

const userDataSchema = mongoose.Schema(
    {
        email: {
            type: String,
            required: [true, "Please enter a email"]
        },
        userName: {
            type: String,
            required: [true, "Please enter a firstName"]
        },
        image: {
            type: String,
        },
        dateOfBirth: {
            type: String,
        },
        bio: {
            type: String,
        },
        disability: {
            type: String,
        },
        accessibilityNeeds: {
            type: String,
        },
        gender: {
            type: String,
        },
        password: {
            type: String,
            required: [true, "Please enter a password"]
        },
        phoneNumber: {
            type: String,
            required: [true, "Please enter a phoneNumber"]
        },
        emergencyContact: {
            type: String,
        },
        address: {
            type: String,
        },
        currency: {
            type: String,
        },
        language: {
            type: String,
        },
        payments: {
            nameOnTheCard: { type: String, },
            cardNumber: { type: String, },
            expDate: { type: String, },
        },
        isActive: { 
            type: Boolean,
            default: true 
        } ,
        otp: {
            type: String,
        },
        expiration: {
            type: Date,
        },

    },
    {
        timestamps: true
    }
)
const userData = mongoose.model('userData', userDataSchema, 'userData');

module.exports = userData;
