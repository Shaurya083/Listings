const Listing = require("../models/listing");
module.exports.index = async (req,res)=>{
  const allListing = await Listing.find({});
  res.render("listings/index.ejs",{allListing});
  }

  module.exports.renderNewForm = (req,res)=>{
  res.render("listings/new.ejs");
}

module.exports.showListing = async (req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id).populate("reviews").populate("owner");
    if(!listing){
      req.flash("error","Listing you requested for does not exists");
      res.redirect("/listings");
    }
    console.log(listing);
 res.render("listings/show.ejs",{listing});
  }

  module.exports.createlisting = async (req,res,next)=>{
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
        }

        module.exports.renderEdit = async (req,res)=>{
            let {id} = req.params;
            let listing =  await Listing.findById(id);
            res.render("listings/edit.ejs",{listing});
           }

           module.exports.updateList = async (req,res)=>{
               let {id} = req.params;
               await Listing.findByIdAndUpdate(id,{...req.body.listing});
               req.flash("success","Listing Updated");
               res.redirect("/listings");
              }

          module.exports.deleteList = async (req,res)=>{
             let {id} = req.params;
             let deleted = await Listing.findByIdAndDelete(id);
            console.log(deleted);
            req.flash("success","Listing Deleted");
            res.redirect("/listings");
             }