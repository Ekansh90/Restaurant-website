// 1. require module mongoose
const mongoose = require("mongoose");


const mealSchema = new mongoose.Schema({

    /* 
    dont even need this , the object created using this model will store the id recieved from model object
    _id : {
        type : String ,
    } ,
    */
    category : {
        type : String ,
        require : true 
    },

    title:{
        type : String ,
        require : true 
    },

    description :{
        type : String ,
        require : true 
    },

    price : {
        type : Number,
        default : 0.00 
        //require : true 
    },

    imageURL : 
    {
        type : String ,
        require : true
    },




});


const mealModel = mongoose.model("menuRetry2",mealSchema);
module.exports =  mealModel ;