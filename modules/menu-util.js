/*

EVERYTHING IN A MODULE IS PRIVATE . 
IN ORDER TO ACCESS IT [server.js] -: SERVER.JS NEEDS TO IMPORT THIS MODULE VIA REQUIRE AND ACCESS THROUGH A VARIABLE

*/

let items = [ 

    // appetizers
    {
        category: "appetizer",
        title: "Paneer Tikka",
        description: "Grilled chunks of marinated paneer (Indian cottage cheese) served with mint chutney.",
        price: "$7.00",
        imageURL: "/images/cards/menu_page/paneer_tikka.jpg"
    },
    {
        category: "appetizer",
        title: "Samosa",
        description: "A deep-fried pastry filled with spiced potatoes, peas, and herbs.",
        price: "$3.50",
        imageURL: "/images/cards/menu_page/samosa.jpg"
    },
    {
        category: "appetizer",
        title: "Pani Puri",
        description: "Hollow puris filled with a tangy, crushed potatoes , chickpeas & flavored water.",
        price: "$5.00",
        imageURL: "/images/cards/menu_page/pani_puri.jpeg"
    },
    {
        category: "appetizer",
        title: "Aloo Tikki",
        description: "Crispy fried potato patties served with sweet and spicy chutneys.",
        price: "$4.00",
        imageURL: "/images/cards/menu_page/aloo_tikki.jpg"
    },
    {
        category: "appetizer",
        title: "Dhokla",
        description: "Steamed savory cake made from rice & chickpea flour, served with a tangy chutney.",
        price: "$3.00",
        imageURL: "/images/cards/menu_page/dhokla.jpg"
    },
    {
        category: "appetizer",
        title: "Paapdi Chaat",
        description: "Crisp fried dough wafers topped with potatoes, chickpeas, yogurt, and tamarind chutney.",
        price: "$4.50",
        imageURL: "/images/cards/menu_page/paapdi_chaat.jpg"
    },
    
    {
        category: "appetizer",
        title: "Mix Pakore",
        description: "Onion , potato & paneer dipped in chickpea flour and deep-fried to crispy perfection.",
        price: "$6.00",
        imageURL: "/images/cards/menu_page/pakore.jpg"
    },
    {
        category: "appetizer",
        title: "Hara Bhara Kebab",
        description: "Minced vegetables and spices skewered and grilled to perfection.",
        price: "$5.50",
        imageURL: "/images/cards/menu_page/hara_bhara_kebab.jpg"
    },

    // Main course

    {
        category: "main-course",
        title: "Chicken Biryani",
        description: "A fragrant rice dish layered with tender pieces of chicken and aromatic spices.",
        price: "$13.50",
        imageURL: "/images/cards/menu_page/biryani.jpg"
    },

    {
        category: "main-course",
        title: "Paneer Butter Masala",
        description: "A creamy tomato-based curry with grilled paneer pieces, flavored with a mix of spices.",
        price: "$12.00",
        imageURL: "/images/cards/menu_page/paneer_butter_masala.jpg"
    },
    
    {
        category: "main-course",
        title: "Palak Paneer",
        description: "Spinach curry with cubes of fresh paneer cooked in a blend of spices.",
        price: "$11.00",
        imageURL: "/images/cards/menu_page/palak_paneer.jpg"
    },
    {
        category: "main-course",
        title: "Cholle Bhatoore",
        description: "A hearty chickpea curry served with deep-fried flatbread (bhature).",
        price: "$9.00",
        imageURL: "/images/cards/menu_page/cholle_bhatoore.jpg"
    },
    {
        category: "main-course",
        title: "Rogan Josh",
        description: "A rich, aromatic lamb curry cooked with yogurt, garlic, and spices.",
        price: "$14.00",
        imageURL: "/images/cards/menu_page/rogan_josh.jpg"
    },
    {
        category: "main-course",
        title: "Tandoori Roti",
        description: "Soft and smoky flatbread baked in a tandoor oven, usually served with curries.",
        price: "$2.50",
        imageURL: "/images/cards/menu_page/tandoori_roti.jpg"
    },
    {
        category: "main-course",
        title: "Malai Kofta",
        description: "Deep-fried vegetable balls in a creamy tomato gravy, rich in flavors.",
        price: "$11.50",
        imageURL: "/images/cards/menu_page/malai_kofta.jpg"
    },
    {
        category: "main-course",
        title: "Fish Curry",
        description: "A spicy and tangy fish curry, usually made with regional spices and coconut milk.",
        price: "$12.50",
        imageURL: "/images/cards/menu_page/fish_curry.jpg"
    },

    // Desserts
    {
        category: "dessert",
        title: "Gulab Jamun",
        description: "Soft, deep-fried dough balls soaked in sugary syrup flavored with rosewater.",
        price: "$3.00",
        imageURL: "/images/cards/menu_page/gulab_jamun2.jpg"
    },
    {
        category: "dessert",
        title: "Rasgulla",
        description: "Light and spongy cheese balls soaked in a sugary syrup.",
        price: "$2.50",
        imageURL: "/images/cards/menu_page/rasgulla.jpg"
    },
    {
        category: "dessert",
        title: "Kheer",
        description: "Creamy rice pudding made with milk, sugar, and cardamom, garnished with nuts.",
        price: "$4.00",
        imageURL: "/images/cards/menu_page/kheer.jpg"
    },
    {
        category: "dessert",
        title: "Jalebi",
        description: "Crispy, deep-fried batter soaked in a sugary syrup, often enjoyed warm.",
        price: "$3.50",
        imageURL: "/images/cards/menu_page/jalebi.jpg"
    },
    {
        category: "dessert",
        title: "Kulfi",
        description: "A traditional Indian ice cream made with condensed milk, flavored with cardamom or pistachio.",
        price: "$5.00",
        imageURL: "/images/cards/menu_page/kulfi.jpg"
    },
    {
        category: "dessert",
        title: "Kaju Katli",
        description: "A sweet, dense fudge made with condensed milk and sugar, flavored with cardamom and nuts.",
        price: "$4.50",
        imageURL: "/images/cards/menu_page/kaju_katli.jpg"
    },
    {
        category: "dessert",
        title: "Moong Daal Halwa",
        description: "A sweet dish made with grated carrots, semolina, or lentils, cooked with ghee and sugar.",
        price: "$3.00",
        imageURL: "/images/cards/menu_page/moong_daal_halwa.jpg"
    },
    {
        category: "dessert",
        title: "Mango Lassi",
        description: "A refreshing yogurt drink made with mango pulp, yogurt, and sugar, often served chilled.",
        price: "$4.00",
        imageURL: "/images/cards/menu_page/mango_lassi.jpg"
    }
];

// FUNCTION WHICH RETURNS THIS ITEMS ARRAY
module.exports.getAllItems = 
function(){
    return items ;
};


module.exports.getItemByCategory = 
function (menuItems) 
{
    // Set up singleObject containing filtered array for all categories
    // Data will be set up for arrOfObjects = [0] : appetizers , [1] : main .. so on
    let arrOfObjects = [] ;
    let sizeOfArr = 0 ;

    // if we wish to push an object to array without changing elements , we must create a new object each time
    let singleObject = {
        category : "" ,
        filteredArray : []

    };

    ////////////////////////////////
    // set categoryName to that of first element
    singleObject.category = menuItems[0].category ;
    for( let i = 0 ; i < menuItems.length ; i++ )
    {
        if ( singleObject.category == menuItems[i].category )
        {
            singleObject.filteredArray.push(menuItems[i]) ;
            menuItems[i].category = "" ;
        }
    }
    arrOfObjects.push(singleObject) ;
    sizeOfArr++ ;

    // once initial object having first category gets set up - all first categories will be removed to avoid repetition
    for (let i = 1 ; i < menuItems.length; i++) 
    {
        if (menuItems[i].category != "" ) 
        {
            let tempCategory = menuItems[i].category ;
            let tempFilteredArray = [] ;

            for (let j = 0; j < menuItems.length; j++) 
            {
                if ( tempCategory == menuItems[j].category )
                {
                    tempFilteredArray.push(menuItems[j]);
                    menuItems[j].category = "" ;
                }
                
            }

            // creating tempObject to push each time we change its values 
            singleObject =
            {
                category : tempCategory ,
                filteredArray : tempFilteredArray 
            };

            arrOfObjects.push(singleObject);
            sizeOfArr ++ ;

        }
        
    } 
    
    // fixing the values of categoryNames in newArray
    for (let i = 0; i < arrOfObjects.length; i++) 
    {
        for (let j = 0; j < arrOfObjects[i].filteredArray.length; j++) 
        {
            arrOfObjects[i].filteredArray[j].category = arrOfObjects[i].category;
        }
    }
    return arrOfObjects ;        
    
};