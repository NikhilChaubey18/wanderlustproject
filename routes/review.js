const express = require("express");
const router = express.Router({mergeParams:true});
const Review = require("../models/review.js");
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { reviewSchema} =  ("../schema.js");
const Listing = require("../models/listing.js");
const {isLoggedIn,isReviewAuthor} = require("../middleware.js");

const controllerReview = require("../controller/review.js");


const validateReview = (req,res,next) =>{
    let {error} = reviewSchema.validate(req.body);
    
    if(error) {
      let errMsg = error.details.map((el) => el.message).join(",");
     throw new ExpressError(400, errMsg);
    }else{
      next();
    }
  }




router.post("/", isLoggedIn,  controllerReview.cretaeReview);
  
   // review delte route
   router.delete("/:reviewId",isLoggedIn,isReviewAuthor, wrapAsync(controllerReview.destroyReview));

   module.exports = router;