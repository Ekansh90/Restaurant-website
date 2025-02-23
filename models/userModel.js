// 1. require module mongoose
const mongoose = require("mongoose");

// 2. (ALREADY DONE IN SERVER.JS)connect to mongoose using environment variable - connection string

// 5. require bcryptjs
const bcryptjs = require("bcryptjs");

// 3. Create a schema - document - FOR users COLLECTION
const userSchema = new mongoose.Schema({

    firstName : {
        type : String,
        require : true 
    },

    lastName : {
        type : String,
        require : true 
    } ,

    email :{
        type : String ,
        require: true ,
        unique : true 
    } ,

    passWord : {
        type : String,
        require : true 
    },

    // not using yet
    profilePic : String ,

    dateCreated :{
        type : Date ,
        default : Date.now()
    }

});

// 6. pre function to hash the password before we call save function and send data to the database
userSchema.pre("save", function(next) // without next page will keep on loading , after pre function is done -> call next (save) function
{
    let localUser = this ; // information passed from form saved to local object user

    ////////////////////// HASHING - 2 STEPS
    // 1. GENERATING A FRESH SALT - NEED bcryptjs for this
    bcryptjs.genSalt() // promise
    .then( salt => { // if two users enter same password , password generated  salt will still be different
       
        // 2. hashing the PASSWORD using the SALT
        bcryptjs.hash(  localUser.passWord  , salt) // promise
        .then( hashedPwd => {
            console.log("password hashed successfully");
            localUser.passWord = hashedPwd ;
            next() ;
        })
        .catch( err =>{
            console.log("Error found when hashing password : " + err );
        });
        
    })
    .catch ( err =>{
        console.log("Error found when generating salt : " + err );
    } )
});

// 4. Create a model to interact with database , using nameSchema 
// will store document in the names collection
const userModel = mongoose.model("usersInfo",userSchema);   

/// CURRENTLY IN A MODULE 
// NEED THIS INFO TO BE EXPORTED TO BE USED
module.exports = userModel ;

