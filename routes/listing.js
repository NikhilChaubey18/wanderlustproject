const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const {listingSchema, reviewSchema} =  ("../schema.js");

const {isLoggedIn,isOwner} = require("../middleware.js");

const listingController = require("../controller/listings.js")







const validateListing = (req,res,next) =>{
    let {error} = listingSchema.validate(req.body);
    
    if(error) {
      let errMsg = error.details.map((el) => el.message).join(",");
     throw new ExpressError(400, errMsg);
    }else{
      next();
    }
  };





//Index Route
router.get("/", wrapAsync(listingController.index));
  
//New Route
router.get("/new",isLoggedIn, listingController.renderNewForm);

//Show Route
  router.get("/:id", wrapAsync(listingController.showListings));

  //Create Route
router.post("/",isLoggedIn, wrapAsync(listingController.createListings ));
  //Edit Route
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.renderEditForm));
  //Update Route
router.put("/:id",isLoggedIn, wrapAsync(listingController.updateListings));

  //Delete Route
router.delete("/:id",isLoggedIn,isOwner, wrapAsync(listingController.destroyListings));

module.exports = router;