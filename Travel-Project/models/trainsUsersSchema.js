const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const trainUsersSchema = new Schema({

    UserName:{
        type:String
    },
    Gender:{
        type:String,
    
    },
    Email:{
        type:String
    },
    PhoneNo:
    {
        type:String
    },
    Age:{
        type:Number
    },
    BerthPreference:
    {
        type:String
    },
    BordingPoint:{
      type:String
    }
    

})

const trainUserDataModel = model("trainUserData", trainUsersSchema);

module.exports = trainUserDataModel;