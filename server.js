const path = require("path");
const express = require("express");
const app = express();
const expressLayouts = require('express-ejs-layouts');


// server.js - needs to import module (by require) and store it in a local variable
const menuItemsUtil = require('./modules/menu-util');


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////// app.use()
// make assets folder local
app.use(express.static(path.join(__dirname, '/assets/')));


// SET UP EJS
app.set('view engine','ejs');
app.set("layout", "layouts/main"); // main ejs is the layout template to be used - contains navbar and about section
app.use(expressLayouts);

// set up body parser  -- parses info entered in form to organized form
app.use(express.urlencoded({extended:true}));

// set up dotenv so we can configure our send grid api key and put it in gitignore
const dotenv = require("dotenv");
dotenv.config({path:"./config/keys.env"}); 

///////////////////////////////////////////////////////////////////// set up mongoose ///////////////////////////////////////////////////////////////////// 
// require mongoose module - connect to mongoose at end [server start condition : successful connection to mongoose]
const mongoose = require("mongoose");

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// 
// set up express-session
const session = require("express-session");

// set up session
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true
}));

// place this before routes
// store the user found after searching(findOne({email})) into global variable using locals 
app.use( (req, res, next) =>{

    // initially undefined but after we redirect from login page a new request is made 
    // (thats why we use redirect , render does not make new request) and store in global variables to access later
    res.locals.user = req.session.user ;
    res.locals.userType = req.session.userType ;
    res.locals.cart = req.session.cart ;

    next() ;

});

// set up after body parser 
const fileUpload = require("express-fileupload");
app.use(fileUpload());


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// vercel : If you are using a template engine in your application (ie: EJS), then you will need to add the line:before your route definitions.
app.set('views', __dirname + '/views');

// if you are using the "express.static()" middleware to define a "public" folder, you must also include the "__dirname" in your path
app.use(express.static(__dirname + '/public'));

require('pg'); // explicitly require the "pg" module
const Sequelize = require('sequelize');
const serverless = require("serverless-http"); // Required for Vercel

app.use("/api", router); // Prefix all routes with `/api`

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////// Add your routes here
// e.g. app.get() { ... }
/*
app.get('/', (req,res) =>
    {
        res.sendFile(path.join(__dirname, '/views/home.html'));
});
*/

// importing general controller 
const homeController = require('./controllers/homeController');
app.use('/',homeController);

// importing registration and login Controller 
const userController = require('./controllers/usersController');
app.use('/users/',userController);

const loadDataController = require('./controllers/newLoadDataController');
app.use('/load-data/',loadDataController);

const empMealsController = require('./controllers/empMealsController');
app.use('/meals/',empMealsController);

const userCartController = require('./controllers/userCartController');
app.use('/cart/',userCartController) ;
/*
app.get('/menus',(req,res) => {
    res.render("menus",{
        menuItemsArray : menuItemsUtil.getItemByCategory( menuItemsUtil.getAllItems())
    });
});
*/




app.get('/success', (req,res) => {
    res.render("success") ;
});

app.get('/blocked', (req,res) => {
    res.render("blocked") ;
});







// This use() will not allow requests to go beyond it . 
// So we place it at the end of the file, after the other routes.
// This function will catch all other requests that don't match any other route handlers declared before it.
// This means we can use it as a sort of 'catch all' when no route match is found.
// WE USE THIS FUNCTION TO HANDLE 404 REQUESTS TO PAGES THAT ARE NOT FOUND .
app.use((req, res) => {
    res.status(404).send("Page Not Found");
});

// This use() will add an error handler function to catch all errors.
app.use(function (err, req, res, next) {
    console.error(err.stack)
    res.status(500).send("Something broke!")
});


////////////////////////////////////// *** DO NOT MODIFY THE LINES BELOW ***

// Define a port to listen to requests on.
const HTTP_PORT = process.env.PORT || 8080;

// Call this function after the http server starts listening for requests.
function onHttpStart() {
    console.log("Express http server listening on: " + HTTP_PORT);
}
  
// Listen on port 8080. The default port for http is 80, https is 443. We use 8080 here
// because sometimes port 80 is in use by other applications on the machine
//app.listen(HTTP_PORT, onHttpStart);


// only start listening if successfully connected to mongoDB
mongoose.connect(process.env.MONGODB_CONNECTION_STRING)
    .then( () => {
        app.listen(HTTP_PORT, onHttpStart);
        console.log("Connection successfully made to Mongo DB");
    })
    .catch( err => {
        console.log("Unable connect to MongoDB database : ERROR -> " + err);
    })


    module.exports = app;
    module.exports.handler = serverless(app); // Required for Vercel