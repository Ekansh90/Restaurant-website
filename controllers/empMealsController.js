const express = require("express");
const router = express.Router() ; // by default everything is private 

const path = require("path");

const mealModel  = require('../models/newMealModel'); 

const menuUtil = require('../modules/menu-util');

// make assets folder local
router.use(express.static(path.join(__dirname, '/assets/')));

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// add route
router.get('/add',(req,res)=>{

    if(  req.session.userType == "restaurant-employee" )
    {
        res.render("empMeals/addMeal",{ //
            validationMessages : {} ,
            values :
            {
                _id : "" , // not needed tho
                category : "",
                title : "",
                description : "",
                price : 0 
            }
        });
    }

    else
    {
        // for redirect use / at beginning
        res.redirect("/general/accessDenied");
    }  


});

router.post('/add',(req,res) =>
    {   
        // console.log(req.body);   
        // removed imageURL FROM REQ.BODY AND ON TIME OF CONSTRUCTING newMeal
        const{ category, title ,description ,price } = req.body ;
        //console.log(req.body);
    
        let passedValidation = true ;
        let validationMessages = {} ; 
        
        
        let errors = [] ;
    
        ////////////////////////////////////
        // checking if valid file extension
        const allowedExtensions = ['.jpg', '.jpeg', '.gif', '.png'];
        
        // req.files.mealImgURL -> RETURNS OBJECT , need the .name property to get a string
        const fileExt = path.extname(req.files.mealImgURL.name).toLowerCase() ;
        if(allowedExtensions.includes(fileExt) == false)
        {
            passedValidation = false ;
            errors.push("file must be of type -> .jpg, .jpeg , .gif , .png");
        }
        
        ////////////////////////////////////
        
        
        // TODO : currently make them required later will validate them
        if (passedValidation) 
        {
    
            const newMeal = new mealModel({ category, title ,description  ,price }) ;
            
            newMeal.save() //promise
                .then( savedMeal =>{
                    console.log("newMeal model saved successfully to database for : "+ savedMeal );              
                    
                    // UPLOADING THE FILE TO DATABASE DONE - NOW STORE LOCALLY TOO
                    // create a unique name for the picture 
                    // store in static folder
                    const mealPic = req.files.mealImgURL ; // string 
                    const uniqueName = `mealPic-${req.body.category}-${req.body.title}${path.parse(mealPic.name).ext}`;
                    
                    console.log("imageURL : "+ uniqueName) ;
    
                    // copy the image to local folder
                    mealPic.mv(`assets/images/cards/menu_page/${uniqueName}`) // promise
                        .then( () =>{
                            mealModel.updateOne(
                                {
                                    _id : savedMeal._id 
                                },
                                {
                                    imageURL : `/images/cards/menu_page/${uniqueName}` 
                                }
                                )
                                    .then( () => {
                                        message = "mealkit addition success" ;
                                        console.log(message);
                                        res.render("general/empSuccess",{
                                            message ,
                                        }) ;
                                        //res.redirect("/");
                                    }) 
                                    .catch( err =>{
                                        console.log("error updating doc :",err);
                                        res.redirect("/");
                                    });
                        })
                        .catch( err => {
                            console.log("error receiving upload : " + err);
                            res.redirect("/");
                        });
                })
                .catch( err => {
                    console.log("model not saved to database - ERROR : " + err) ;
                    errors.push("User Email is already taken by another user. Please pick a new user");
    
                    res.render("empMeals/addMeal",{
                        validationMessages,
                        values : req.body ,
                        errors,
                    });
    
                }) ;
        }
    
        else
        {
            res.render("empMeals/addMeal",{
                
                validationMessages , // pass the validation data to view 
                values : req.body ,
                errors
            });
        }
    
    });

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// delete route // make get and post routes

router.get("/delete/:id",(req,res)=>{

    if(   req.session &&  req.session.user && req.session.userType == "restaurant-employee" )
    {
        const mealId = (req.params.id);
        res.render("empMeals/deleteMeal" , 
        {
            _id : mealId ,
            validationMessages : {} ,
            values : 
            {
                radioButton : "",
            },
            
        });
    }
    

    else
    {
        // for redirect use / at beginning
        res.redirect("/general/accessDenied");
    }  
});


router.post("/delete/:id",(req,res)=>{

    const mealId = (req.params.id);
    const { radioButton } = req.body ;

    const deleteConfirm = req.body.radioButton ;

    if(deleteConfirm == "confirm")
    {
        if(   req.session &&  req.session.user && req.session.userType == "restaurant-employee" )
        {
            console.log("delete initiated");
            mealModel.deleteOne( { _id : mealId } ) // delete one requires field which we are deleting and the value for it
                .then( () => {
                    console.log("deleted one meal for the id: " + mealId);
                    message = "deleted one meal successfully" ;
                    res.render("general/empSuccess",{
                        message ,
                    }) ;
                })
                .catch( err => {
                    
                    console.log("deleted error : " + err);
                    message = "attempt to delete meal  : unsuccessful" ;
                    res.render("general/empSuccess",{
                        message ,
                    }) ;
                });
        }

    }

    else
    {
        console.log("delete cancelled");
        message = "Request To delete cancelled" ;
        res.render("general/empSuccess",{
            message ,
        }) ;

    }

});

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// update route

router.get("/update/:id",(req,res)=>{

    const mealId = (req.params.id);
    if(   req.session &&  req.session.user && req.session.userType == "restaurant-employee" )
    {

        mealModel.findOne( {_id :mealId })
        .then( meal => {

            //if (meal) 
            {
                res.render("empMeals/updateMeal",
                {
                    // meal ,
                    _id : mealId ,
                    validationMessages : {} ,
                    values :
                    {
                        _id : mealId ,
                        category : meal.category,
                        title : meal.title,
                        description : meal.description,
                        price : meal.price,

                    }
                })
                
            }

        })
        .catch( err =>{
            console.log("could not find the given mealkit , error : " + err );
        })
    }

    else
    {
        // for redirect use / at beginning
        res.redirect("/general/accessDenied");
    }  
    

});

router.post("/update/:id",(req,res)=>
{
    const mealId = (req.params.id);
    console.log(req.body);

    
        let passedValidation = true ;
        let validationMessages = {} ;   
    
        let errors = [] ;
    
        ////////////////////////////////////
        // checking if valid file extension
        const allowedExtensions = ['.jpg', '.jpeg', '.gif', '.png'];
        
        // req.files.mealImgURL -> RETURNS OBJECT , need the .name property to get a string
        const fileExt = path.extname(req.files.mealImgURL.name).toLowerCase() ;
        if(allowedExtensions.includes(fileExt) == false)
        {
            passedValidation = false ;
            errors.push("file must be of type -> .jpg, .jpeg , .gif , .png");
        }
        
        ////////////////////////////////////
    
        if (passedValidation) 
        {
                    const mealPic = req.files.mealImgURL ; // string 
                    // TODO : try accessing it with req.body and then save it to database
    
                    const uniqueName = `mealPic-${req.body.category}-${req.body.title}${path.parse(mealPic.name).ext}`;
                    console.log("imageURL : "+ uniqueName) ;
    
                    // copy the image to local folder
                    mealPic.mv(`assets/images/cards/menu_page/${uniqueName}`) // promise
                        .then ( () => {
    
                            mealModel.updateOne({ _id : mealId },
                                {
                                    $set : {
                                    category : req.body.category,
                                    title : req.body.title,
                                    description : req.body.description,
                                    price : req.body.price,
                                    imageURL : `/images/cards/menu_page/${uniqueName}` , 
                                  }  
                                })
                                .then( () =>{
                                    console.log("user update success");
                                    message = "user update success" ;
                                    res.render("general/empSuccess",{
                                        message ,
                                    }) ;
                                    //res.redirect("/");
                    
                                })
                                .catch( err => {
                                    console.log("error while updating model : " + err );
                                    res.send("error for update") ;
                                })
                        })
                        .catch( err => {
                            console.log("something error happend : " , err);
                        }) 
            
        }
    
        else
        {
            res.render("empMeals/updateMeal",{
    
                validationMessages , // pass the validation data to view 
                errors,
                values : req.body ,
                _id : mealId ,
            });
        }

    

    

});



















module.exports = router ;
