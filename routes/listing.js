const express = require("express");
const router = express.Router({mergeParams: true});
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const {listingSchema, reviewsSchema} = require("../schema.js");
const Listing = require("../models/listing.js");
const {isLoggedin,isOwner} = require("../middleware.js");


 const validateListing = (req,res,next)=>{
  let { error} = listingSchema.validate(req.body);
  if(error){
    let errMsg = error.details.map((el)=>el.message).join(",");
    throw new ExpressError(400,errMsg);
  }else{
    next();
  }
 }

const listingController = require("../controllers/listings.js");
//Index route /, 
//wrap async function goes inside controller
router.get("/", wrapAsync(listingController.index));


  //new route
router.get("/new",isLoggedin,listingController.renderNewForm);


  //Show route
  router.get("/:id", wrapAsync(listingController.showListing));

  //create4 route
    router.post("/", validateListing, isLoggedin,wrapAsync(listingController.createlisting));
  
  
   //edit route
   router.get("/:id/edit",
    isLoggedin, 
    isOwner,
    wrapAsync(listingController.renderEdit));
  
   //update route
   router.put("/:id", 
    isLoggedin,
    isOwner,
    wrapAsync(listingController.updateList));
  
   //delete route
   router.delete("/:id", 
    isLoggedin,
    isOwner,
    wrapAsync(listingController.deleteList));
   module.exports = router;