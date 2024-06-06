const mongoose = require('mongoose')
const googleUserSchema = mongoose.Schema(
    {
        googleId: {
            type: String,
            required: [true, "Please enter a googleId"]
        },
        email: {
            type: String,
        },
        userName: {
            type: String,
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
        },
        phoneNumber: {
            type: String,
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
            cardNumber: { type: String,},
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

const GoogleUserData = mongoose.model('GoogleUserData', googleUserSchema, 'GoogleUserData')
module.exports = GoogleUserData