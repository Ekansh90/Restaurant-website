const express = require("express");
const router = express.Router() ; // by default everything is private 

// 3. require the model 
const userModel = require("../models/userModel");
const bcryptjs = require("bcryptjs");

/*
// when making form - 2 requests : 1) get + 2) post to capture the information
*/

// 1. get data from this url
// route to registration page  (GET /users/sign-up)
router.get('/sign-up', (req,res) => {
    res.render("users/sign-up",
    {
        validationMessages : {} ,
        values :
        {
            firstName : "" ,
            lastName : "" ,
            email : "" ,
            passWord : "" ,
        }
    });
}
);

// 2. post info to same url
// route to registration page  (GET /users/sign-up)
router.post('/sign-up' , (req,res) => {

    console.log(req.body) ;
    
    // VALIDATION - on server side always validate data
    const { firstName ,lastName ,email , passWord } =  req.body ;

    let passedValidation = true ;
    let validationMessages = {} ;

    // errors to display at top of log-in page
    let errors = [] ;

    if(firstName.trim().length === 0 || firstName.trim().length < 3)
    {
        passedValidation = false ;
        validationMessages.firstName = "first name length is invalid" ; 
    }

    
    if(lastName.trim().length === 0 || lastName.trim().length < 3)
    {
        passedValidation = false ;
        validationMessages.lastName = "last name length is invalid" ; 
    }

    // validation for email

    const emailRegEx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; 
    if (emailRegEx.test(email) == false)
    {
        passedValidation = false ;
        validationMessages.email = "email is invalid" ; 
    }
    
    // validation for passWord
    if(passWord.trim().length < 8 || passWord.trim().length > 12 )
    {
        passedValidation = false ;
        validationMessages.passWord = "password is invalid" ; 
    }

    // if password length is valid
    if(passWord.trim().length >= 8 && passWord.trim().length <= 12 )
    {
        let upperCaseLetters = 0 ;
        let lowerCaseLetters = 0 ;
        let numOfDigits = 0 ;
        let SymbolsExist = 0 ;

        // checking if password has uppercase letters
        for (let i = 0; i < passWord.trim().length; i++) 
        {
            if (passWord[i] !== passWord[i].toLowerCase()) // if doesn't exactly match lower case - uppercase found
            {
                upperCaseLetters++ ;
            }
            
        }

        // checking if password has lowercase letters
        for (let i = 0; i < passWord.trim().length; i++) 
        {
            if (passWord[i] !== passWord[i].toUpperCase()) // if doesn't exactly match lower case - uppercase found
            {
                lowerCaseLetters++ ;
            }
            
        }

        // checking if password has numbers
        for (let i = 0; i < passWord.trim().length; i++) 
        {
            for (let j = 0; j < 9; j++) 
            {
                if (passWord[i] == j) 
                {
                    numOfDigits++ ;
                }
                
            }
            
        }

        // checking if special symbol exists in password
        const regEx =/[^A-Za-z0-9\s\.,;:'"!?()-]/;
        SymbolsExist = regEx.test(passWord) ;

        if (upperCaseLetters == 0 ) 
        {
            passedValidation = false ;
            validationMessages.passWord = "password must contain at least one upper case letter" ; 
        }

        else if (lowerCaseLetters == 0 ) 
        {
            passedValidation = false ;
            validationMessages.passWord = "password must contain at least one lower case letter" ; 
        }

        else if (numOfDigits == 0 ) 
        {
            passedValidation = false ;
            validationMessages.passWord = "password must contain at least one digit" ; 
        }

        else if(SymbolsExist == false)
        {
            passedValidation = false ;
            validationMessages.passWord = "password must contain at least one special symbol" ; 
        }

    }

    ////////////////////////////////// Checking if user tries to register with already existing e-mail
    userModel.findOne({email}) // if found mail already exists
        .then( user => {
            if(user)
            {
                passedValidation = false ;
                validationMessages.email = "User already registered with the same email , please pick another email to register."
            }
        })
        .catch( err=> {
            console.log("some error occurred when searching for whether email already exists. => " + err);
        });

    ////////////////////////////////// IF VALIDATION PASSED
    if (passedValidation) 
    {

        ////////////////////////////////////////////////////////////////////////////////// CREATE A NEW DOCUMENT AND SEND IT TO MONGOOSE
        const newUser = new userModel({ firstName , lastName , email , passWord });
        
        newUser.save() //promise
            .then( savedUser => {
                console.log("newUser model saved successfully to database for : " + savedUser );
                

                /////////////////////////////// SET UP SEND GRID AND SEND MAIL
                
                // 1. set up send grid 
                const sgMail =  require("@sendgrid/mail") ;
                sgMail.setApiKey(process.env.SEND_GRID_API_KEY);
                
                // 2. constructing the email and the message it contains
                const msg = 
                {
                    to : `${email}`,
                    from : "ekanshishi@gmail.com", // should be same as the one set up in send grid
                    subject : "Sign Up form submitted successfully" ,
                    html : 
                    `
                    Hello dear visitor , <br>
                    Welcome to The Indian Kitchen . <br>
                    Your account has been registered with us successfully . <br>
                    You may continue online shopping now . <br> <br> 
                    
                    Here are the details you entered <br>
                    in order to help you with future logins . <br> <br>
                    
                    Visitor's full name : ${firstName} ${lastName}<br>
                    Visitor's Email : ${email}<br>
                    Visitor's Password : ${passWord}<br>
                    Visitor's Hashed Password : ${savedUser.passWord}<br>
                    
                    From The Indian Kitchen , <br>
                    -Ekansh <br>
                    `
                    ,
                };
                
                // 3. sending the mail
                sgMail.send(msg)
                .then( () => {
                    // res.send("success, validation passed"); // show success if worked 
                    console.log("Mail sent successfully");
                    res.redirect('/success');
                })
                .catch( err =>{
                    console.log(err) ; // show error if email not sent
                    // then re-render form

                    
                    res.render("users/sign-up",{
                        validationMessages , // pass the validation data to view 
                        values : req.body ,
                    });
                    
                });
                 /////////////////////////////////////////////////////
            })
            .catch( err => {
                // email field in newUser is unique , if we try to make another field save throws an error 
                // error thrown for same users but not the case each time 
                console.log("model not saved to database - ERROR : " + err) ;
                //errors.push("User Email is already taken by another user. Please pick a new user");
                //validationMessages.email = "User Email is already taken by another user. Please pick a new user" ;
                res.render("users/sign-up",{
                    validationMessages , // pass the validation object that stores errors
                    values : req.body ,
                    errors
                });
            });


        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


    }

    else
    {
        res.render("users/sign-up",{

            validationMessages , // pass the validation data to view 
            values : req.body ,
        });
    }

});

// ROUTES FOR LOG-IN
router.get('/log-in', (req,res) =>
    {
        res.render("users/log-in" , 
        {
            validationMessages : {} ,
            values : 
            {
                email : "" ,
                passWord : "" ,
                radioButton : "",
            },
      
        });
    }
    );

router.post('/log-in',(req,res) => {

    console.log(req.body) ; // show user input
    const { email,passWord , radioButton } = req.body ; // storing email , password in req.body

    // errors to display at top of log-in page
    let errors = [] ;

    let passedValidation = true ;
    let validationMessages = {} ;

    if (email.trim().length ===0) 
    {
        passedValidation = false ;
        validationMessages.email = "Email cannot be empty" ;
    }

    if (passWord.trim().length ===0 ) 
    {
        passedValidation = false ;
        validationMessages.passWord = "Password cannot be empty" ;
    }

    if (passedValidation) 
    {
        userModel.findOne({email}) // promise
            .then( user =>{

                // user found
                if(user){
                    // comparing the password - but even same passwords have different hashed values
                    // bcrypt has a compare function
                    bcryptjs.compare( passWord , user.passWord ) // promise
                        .then( matched =>{
                            if(matched)
                            {
                                console.log("logged in successfully");

                                // create a new session - storing the values of user in a session variable(user)
                                req.session.user = user; 

                                //storing radioButton into req.session variable(userType)
                                req.session.userType = req.body.radioButton ;
                                console.log("value successfully stored into session : " + req.session.userType );
                                                                
                                // DONE :
                                // 1) user does not have type (in the model - with which we make a document) - store in session variable not the user model
                                // 2) update navbar link to redirect appropriately , not ,render redirect
                                // 3) also for anonymous user - user not set session ,  customer only cart , clerk only list
                                // 4) complete mealkit controller 

                                if (req.session.userType == "restaurant-employee") 
                                {
                                    //res.redirect('/mealkits/list');   
                                    res.redirect('/load-data/');   

                                }

                                if (req.session.userType == "customer") 
                                {
                                    
                                    res.redirect('/menus');  
                                }
                                
                            }

                            else
                            {
                                errors.push("Sorry, you entered an invalid email and/or password");
                                console.log(errors[0]);
                                res.render("users/log-in",{
                                    validationMessages ,
                                    values : req.body ,
                                    errors,
                                });
                            }

                        })
                        .catch( err =>{

                            errors.push("Could not compare the passWord . : err " + err);
                            console.log(errors[0]);
                            res.render("users/log-in",{
                                validationMessages ,
                                values : req.body ,
                                errors,
                            });
                        });
                    
                }

                else
                {
                    //errors.push("Could'nt  find the user : " + email );
                    errors.push("“Sorry, you entered an invalid email and/or password");
                    console.log(errors[0]);
                    res.render("users/log-in",{ 
                        validationMessages ,
                        values : req.body ,
                        errors,
                    });
                }

            })
            .catch( err => {
                
                // failed to search the database - not did not found a record
                errors.push("Could'nt get the document. : " + err);
                console.log(errors[0]);
                res.render("users/log-in",{
                    validationMessages ,
                    values : req.body ,
                    errors,
                });
            });

    }

    else
    {
        res.render("users/log-in" ,{
            validationMessages , // passing the errors to the view
            values : req.body , // contents of req.body (email,password to values) 
            errors,
        });
    }
}) ;

///////////////////////////////////////////////////////////
// logout

/*
router.get("/logout" , (req,res)=>{

    req.session.destroy() ;
    //res.redirect('/formSuccess');   
    res.redirect("/users/log-in");
});
*/

router.get("/logout" , (req,res)=>{

    req.session.destroy((err) => {
        if (err) {
            console.error("Error destroying session:", err);
            return res.status(500).send("Error logging out");
        }
    
        // Remove session from MongoDB
        if (req.sessionID && req.sessionStore) {
            req.sessionStore.destroy(req.sessionID, (err) => {
                if (err) {
                    console.error("Error removing session from MongoDB:", err);
                }
            });
            res.clearCookie("connect.sid"); // Ensure session cookie is cleared
        }
    
        res.redirect("/users/log-in");
    });
});


///////////////////////////////////////////////////////////
module.exports = router; // can be included in server.js