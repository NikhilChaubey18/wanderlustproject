const Listing = require("../models/listing.js");

module.exports.index = async (req, res) => {
    const allListings = await Listing.find({}); // await Listing.find({}); to retrieve all listings from the Listing collection. It logs the retrieved listings and optionally returns the result for further processing.
    res.render("listings/index.ejs", { allListings });// tells Express.js to render the EJS template located at "listings/index.ejs" and inject the allListings data into the template.
  };


module.exports.renderNewForm = (req, res) => {
 
    res.render("listings/new.ejs");
  };

  module.exports.showListings = async (req, res) => {
    let { id } = req.params; // extracting id from the parameter
    const listing = await Listing.findById(id).populate({path:"reviews",populate:{ path:"author"},}).populate("owner");
    if(!listing){
        req.flash("error", "listing Not Found");  
        res.redirect("/listings")
    }
    console.log(listing);
    res.render("listings/show.ejs", { listing });
  };

  module.exports.createListings = async(req, res, next ) => {
  
    const newListing =  new Listing(req.body.listing); //req.body.listing accesses a specific property named listing from the request body data
  
    newListing.owner = req.user._id;   //while adding listings get owner
   await newListing.save();
   req.flash("success", "listing added sucessfully");
 res.redirect("/listings");

}

module.exports.renderEditForm = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs", { listing });
  };


  module.exports.updateListings = async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing }); //The spread operator (...) is used to create a shallow copy of req.body.listing, ensuring that the update operation does not directly modify the original req.body.listing object.
    res.redirect(`/listings/${id}`);
  };


  module.exports.destroyListings = async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success", "listing deleted sucessfully");
    res.redirect("/listings");
  }