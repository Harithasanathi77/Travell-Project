const mongoose = require("mongoose");
const { Schema, model } = mongoose;


const hotelImagesSchema = new Schema({
  image:{
    type:String,
    required:true,
  }
})

const hotelInfosentencesSchema = new Schema({
  hotelInfosentences:{
    type:String,
    required:true,
  }
})


const hotelFaqSchema = new Schema({
  faqQuestion:{
    type:String,
    required:true,
  }
  ,
  faqAnswer:{
    type:String,
    required:true,
  }
})


const costumerReviewSchema = new Schema({
  costumerImg:{
    type:String,
    required:true,
  },
  costumerName:{
    type:String,
    required:true,
  },
  costumerReview:{
    type:String,
    required:true,
  } 
})

const hotelReviewSchema = new Schema({
  rating:{
    type:Number,
    required:true
  },
  review:{
    type:String,
    required:true
  },
  userId:{
    type:String,
    required:true
  },
  reviewDate:{
    type:Date,
    required:true
  },
  ApprovedReview:{
    type:String,
    required:true,
    default:"PENDING"
  }
});

const hotelsDataSchema = new Schema({

 hotelImages:[
  hotelImagesSchema
 ],

hotelInformationSentences:[
  hotelInfosentencesSchema
],

hotelFaqs:[
  hotelFaqSchema 
],

hotelReview:[
costumerReviewSchema
],
hotelUserReview:[
  hotelReviewSchema
],










  hotelImg: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
popularFilters:{
  type: String,
    required: true,
 },
  roomFacilties: {
    type: String,
    required: true,
  },
  
 activities:{
  type:String,
  required:true
 },
 rating:{
  type:Number,
  required:true
 },
 review:{
  type:Number,
  required:true
 },

  price: {
    type: Number,
    required: true
  },

  salesprice:{
    type: Number,
    required: true
  },
  totalPrice:{
    type: Number,
    required: true
  },

  offer:{
    type:Number,
    required:true
  },
  taxandcharges:{
    type:String,
    required:true
  },
  levels:{
    type:Number,
    required:true
  },
  availabilitylevel:{
    type:Number,
    required:true
  },

 
  categoryId: {
    type: String,
    required: true,
  },

 
  hotelLogo: {
    type: String,
    required: true,
  },
 
  roomType: {
    type: String,
    required: true,
  },

  checkInDate: {
    type: Date,
    required: true,
  },
  checkOutDate: {
    type: Date,
    required: true,
  },
 
});

const hotelsDataModel = model("hotelsData", hotelsDataSchema);

module.exports = hotelsDataModel;
