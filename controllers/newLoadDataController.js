const express = require("express");
const router = express.Router() ; // by default everything is private 
const path = require("path");

// utility module to sort the data 
const menuUtil = require('../modules/menu-util');

// REQUIRE THE NEWMEALMODEL
const mealModel  = require('../models/newMealModel'); 

router.get('/', (req,res) => {

    // Checks the following :
    // 1) session has been established
    // 2) user has been established for the session
    // 3) userType (user logged in through radio buttons) is a clerk 

    if(   req.session &&  req.session.user &&  req.session.userType == "restaurant-employee" )
        {
            //res.send("READY TO LOAD DATA");
            let message = "READY TO LOAD DATA" ;
            res.render("general/empSuccess", {
                message ,
            });
        }

    else
    {
        res.status(403).redirect("/general/accessDenied");
        //res.redirect("/mealkits/accessDenied");
    }
});

router.get('/meals',(req,res) => {

    let message = "";
    if(  req.session &&  req.session.user &&  req.session.userType == "restaurant-employee" )
    {
        mealModel.countDocuments()
        .then( count => {
    
            if(count === 0)
            {
                mealModel.insertMany( menuUtil.getAllItems() )
                .then(() =>{
                    message = "Data has been successfully loaded into the database." ;
                    res.render("general/empSuccess", {
                        message ,
                    });
                })
                .catch( err => {
                    console.log("something went wrong : " + err);
                });
            }
    
            else
            {
                message = "Data has already been loaded into the database" ;
                res.render("general/empSuccess", {
                    message ,
                });
            }
    
        }) 
    }

    else
    {   
        res.status(403).redirect("general/accessDenied");
        // or can render the error message on clerkSuccess
        
        
        //res.status(403).render("error",{message:"unauthorized"});
        //res.redirect("/mealkits/accessDenied");
    }
});

module.exports = router ;