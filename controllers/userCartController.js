const express = require("express");
const router = express.Router() ; // by default everything is private 

const path = require("path");

const mealModel  = require('../models/newMealModel'); 

const menuUtil = require('../modules/menu-util');

// make assets folder local
router.use(express.static(path.join(__dirname, '/assets/')));

/////////////////////////////////////////////////////////////
// MAKING LOCAL TO controller  OUTSIDE - AS THEN WE DON'T MAKE CHANGES BUT JUST USE IT 
let localMealsArray = [] ;

// populating the array to use the find function - for some reason storing in res.locals was not working
mealModel.find()
            .then( mealObj =>
                {
                    if(mealObj) // FIND RETURNS A MODEL , model needs to be converted to object type
                    {
                        mealObj.forEach( singleMeal => 
                            {
                                localMealsArray.push(singleMeal.toObject());
                            });

                    }
                })
                .catch( err =>{
                    console.log("Could'nt get the document. : " + err); 
                });

////////////////////////////////////////////////
const prepareView = function(req,res,message)
{
    let viewModel = {
        message ,
        hasMeals : false ,
        cartTotal : 0 ,
        meals : [] ,
        taxes : 0 ,
        netTotal : 0 ,
    };

    if(req.session && req.session.user && req.session.userType == "customer")
    {
        let cart = req.session.cart || [] ;
        viewModel.hasMeals = cart.length > 0 ;
        let calcCartTotal = 0 ;

        cart.forEach( cartMeal =>{
            calcCartTotal += cartMeal.meal.price * cartMeal.qty ;
        });
        viewModel.cartTotal = calcCartTotal ;
        viewModel.meals = cart ;
        viewModel.taxes = viewModel.cartTotal * 0.10 ;
        viewModel.netTotal = viewModel.cartTotal + viewModel.taxes ;
    }


    req.session.userTransactionDetails = viewModel ;
    console.log("cart details :");
    console.log(viewModel)
    res.render("userCart/cartPage",viewModel);
}


// or better to find from the database 
const findMeal = function(id){
    return localMealsArray.find( meal=>{
        let  mealIdFromArr = meal._id;
        return mealIdFromArr == id ;
    });   
}


router.get('/',(req,res)=>{
    prepareView(req,res);
});


/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// add route

router.get("/add/:id",(req,res)=>{

    let message = "";
    const mealId = parseInt(req.params.id);

    if(req.session.user && req.session.userType == "customer")
    {
        // let cart = req.session.cart || [] ;
        // req.session.cart = cart ;
        let cart = req.session.cart = req.session.cart || [] ;

        let meal = findMeal(req.params.id);
    
        if(meal)
        {
            let found = false ;
            cart.forEach( cartMeal =>{
                if(cartMeal.meal._id == req.params.id)
                {
                    // meal already exists in cart
                    found = true ;
                    ++cartMeal.qty ;
                    cartMeal.netSingleMealPrice = cartMeal.qty * cartMeal.meal.price ;
                }
            });

            
            if (found)
            {
                message = `The ${meal.title} was already added to cart , incrementing quantity`;
            }
    
            else
            {
                // did not exist before
                cart.push({
                    id:mealId ,
                    qty : 1 ,
                    netSingleMealPrice : meal.price ,
                    meal ,// returned from findMeal fn , or try pulling from database
                    
                })
    
                cart.sort( (a,b) => a.meal.title.localeCompare(b.meal.title));
                message = `The ${meal.title} was added to cart`;
                
            }
        }

        else{
            // meal couldn't be found
            message = "meal is not in the database";
        }
    }

    else{
        // not logged in
        message = "you must be logged in to add meals";

    }


    //prepareView(req,res,message);
    res.redirect('/cart');
});

router.get("/remove/:id",(req,res)=>{

    let message = "" ;
    if(req.session && req.session.user && req.session.userType == "customer")
    {
        let cart = req.session.cart || [] ;
        console.log("cart before changing : ");
        console.log(cart);

        // find index of meal in shopping cart
        const index = cart.findIndex( cartElement => cartElement.meal._id == req.params.id);
        if(index >= 0 ) // meal found
        {
            if(cart[index].qty > 1)
            {
                cart[index].qty -- ;
                cart[index].netSingleMealPrice -= cart[index].meal.price ;
            }

            else if(cart[index].qty == 1)
            {
                cart.splice(index,1);
            }
        }

        else
        {
            message = "meal was not found in the cart";
        }

        console.log("cart after changing : ");
        console.log(cart);
        
    }

    else{
        message = "user must be logged in";
    }


    //prepareView(req,res,message);
    // redirect to cart , which will call prepareView function itself , instead of rendering using the function in add and remove routes
    res.redirect('/cart');



});

router.get("/clear/:id",(req,res)=>{

    let message  ;
    if(req.session && req.session.user && req.session.userType == "customer")
    {
        let cart = req.session.cart || [] ;
        const index = cart.findIndex( cartElement => cartElement.meal._id == req.params.id);

        if(index >= 0)
        {
            message = `Removed "${cart[index].meal.title}" from the cart.`;
            cart.splice(index,1);
        }

        else
        {
            message = "meal was not found in cart"

        }
    }
    else{
        message = "user must be logged in";
    }

    //prepareView(req,res,message);
    res.redirect('/cart');

});

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// sending mail on checkout
router.get("/checkout",(req,res)=>{
    
    let errors = "";
    console.log("complete user detail:")
    console.log(req.session.userTransactionDetails);// set up in prepareView

    if(req.session.cart)
    {

        /////////////////////////////// SET UP SEND GRID AND SEND MAIL
        // 1. set up send grid 
        const sgMail =  require("@sendgrid/mail") ;
        sgMail.setApiKey(process.env.SEND_GRID_API_KEY);

        let messageArr = [] ;

        req.session.userTransactionDetails.meals.forEach( cartMeal => {
            messageArr.push("Title : " + cartMeal.meal.title + " | Price: " + cartMeal.meal.price + " | Quantity: " + cartMeal.qty);
        });

        console.log("new array made of strings");
        console.log(messageArr);
        
        // 2. constructing the email and the message it contains
        const msg = 
        {
            to : `${req.session.user.email}`,
            from : "ekanshishi@gmail.com", // should be same as the one set up in send grid
            subject : "Order placed successfully" ,
            html : 
            
            `
            Hello dear visitor , <br>
            Your order has been successfully placed with us  . <br> <br> 
            
            Here are the details of the order : <br> <br>
            
            ${messageArr.map(messageStr => 
                `
                <div>
                ${messageStr}
                </div>
                <br>
                `
            ).join('')}
            <br>
            
            SubTotal : ${req.session.userTransactionDetails.cartTotal.toFixed(2)} , <br>
            Taxes : ${req.session.userTransactionDetails.taxes.toFixed(2)} , <br>
            Total : ${req.session.userTransactionDetails.netTotal.toFixed(2)} .<br> <br>
                      
            From Delish Dish , <br>
            -Ekansh <br>
            `
            ,
        };
        
        //console.log(msg);
        
        // 3. sending the mail
        sgMail.send(msg)
        .then( () => {
            console.log("Mail sent successfully");
        })
        .catch( err =>{
            console.log(err) ; // show error if email not sent
            // then re-render cart page
            res.render("userCart/cartPage",{
                // errors,
                errors : err ,
            });
            
        });
        
        
    }
    

    else{
        // show an error on cart page at top

        errors = "Cart is Empty please add some items in order to checkout";
        res.render("userCart/cartPage",{
            errors ,
        });
    }
    // reset the cart , not destroying the session to keep user logged in
    req.session.cart = [] ;
    res.redirect("/");

});

module.exports = router; // can be included in server.js



