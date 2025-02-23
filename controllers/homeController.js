const express = require("express");

// by default everything is private in this file , needs to be exported using a router 
const router = express.Router() ;

const mealModel  = require('../models/newMealModel'); 
const menuUtil = require('../modules/menu-util');

// as whenever we add data gets updated , we need to pull the data from mongo db again
router.get('/', (req,res) => {
    res.render("general/home") ;
});

router.get('/menus', (req, res) => {
    mealModel.find()
    .then(mealObj => {
        let localAllMealsArray = mealObj.map(meal => meal.toObject());

        res.render("general/mealMenus", {
            menuItemsArray: menuUtil.getItemByCategory(localAllMealsArray),
            selectedCategory: "all" // Default to "all"
        });
    })
    .catch(err => {
        console.log("Error: " + err);
    });
});


router.post('/menus', (req, res) => {
    console.log(req.body.category);
    let selectedCategory = req.body.category || "all"; // Use category from form

    mealModel.find()
    .then(mealObj => {
        let localAllMealsArray = mealObj.map(meal => meal.toObject());

        res.render("general/mealMenus", {
            menuItemsArray: menuUtil.getItemByCategory(localAllMealsArray),
            selectedCategory: selectedCategory // Keep selection on refresh
        });
    })
    .catch(err => {
        console.log("Error: " + err);
    });
});
module.exports = router ;