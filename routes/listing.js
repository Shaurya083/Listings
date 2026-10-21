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


//Index route /, 
router.get("/", wrapAsync(async (req,res)=>{
  const allListing = await Listing.find({});
  res.render("listings/index.ejs",{allListing});
  }));

  //new route
router.get("/new",isLoggedin,(req,res)=>{
  res.render("listings/new.ejs");
})


  //Show route
  router.get("/:id", wrapAsync(async (req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id).populate("reviews").populate("owner");
    if(!listing){
      req.flash("error","Listing you requested for does not exists");
      res.redirect("/listings");
    }
    console.log(listing);
 res.render("listings/show.ejs",{listing});
  }));

  //create4 route
    router.post("/", validateListing, isLoggedin,wrapAsync(async (req,res,next)=>{
     // try{
     let result = listingSchema.validate(req.body);
    // console.log(result);
      let {title,description,image,price,location,country} = req.body.listing;
      const newListing = new Listing({title,description,image,price,location,country});
      if(image){
        newListing.image = {
          filename : "listingimage",
          url :image,
        };
      }
      // if(!newListing.description){
      //   throw new ExpressError(404,"Send me description");
      // }
      // if(!newListing.title){
      //   throw new ExpressError(404,"Send me title");
      // }
      newListing.owner = req.user._id;
        await newListing.save();
         req.flash("success","New Listing Created");
   res.redirect("/listings");
  //     }catch(err){
  // next(err);
  //     }
      })
    );
  
  
   //edit route
   router.get("/:id/edit",
    isLoggedin, 
    isOwner,
    wrapAsync(async (req,res)=>{
    let {id} = req.params;
    let listing =  await Listing.findById(id);
    res.render("listings/edit.ejs",{listing});
   }));
  
   //update route
   router.put("/:id", 
    isLoggedin,
    isOwner,
    wrapAsync(async (req,res)=>{
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    req.flash("success","Listing Updated");
    res.redirect("/listings");
   }));
  
   //delete route
   router.delete("/:id", 
    isLoggedin,
    isOwner,
    wrapAsync(async (req,res)=>{
   let {id} = req.params;
   let deleted = await Listing.findByIdAndDelete(id);
  console.log(deleted);
  req.flash("success","Listing Deleted");
  res.redirect("/listings");
   }));
   module.exports = router;