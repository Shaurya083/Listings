const express = require("express");
const router = express.Router({mergeParams: true});
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const {listingSchema, reviewsSchema} = require("../schema.js");
const Review = require("../models/reviews.js");
const Listing = require("../models/listing.js");
const {isLoggedin} = require("../middleware.js");

const reviewController = require("../controllers/reviews.js");

 const validateReview = (req,res,next)=>{
  let { error} = reviewsSchema.validate(req.body);
  if(error){
    let errMsg = error.details.map((el)=>el.message).join(",");
    throw new ExpressError(400,errMsg);
  }else{
    next();
  }
 }


//Reviews
 //POst route
 router.post("/",validateReview, 
  isLoggedin,
  wrapAsync(reviewController.createReview));

//Delete Review Route
router.delete("/:reviewId",wrapAsync(reviewController.deleteReview));
module.exports = router;
