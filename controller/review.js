const Listing = require("../models/listing.js");
const Review = require("../models/review.js");

module.exports.cretaeReview =  async(req,res) => {
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;
 
    listing.reviews.push(newReview);// Then push the review _id, not the review object itself
   
    await newReview.save(); //// Save the review first
    await listing.save();//// Save the listing
    req.flash("success", "Review Added sucessfully");
    res.redirect(`/listings/${listing._id}`);
   };

   module.exports.destroyReview = async(req,res) => {
    let  {id, reviewId} = req.params;
    await Listing.findByIdAndUpdate(id, {$pull: {reviews:reviewId}});
        await Review.findByIdAndDelete(reviewId);
        
        req.flash("success", "Review Deleted sucessfully");
        res.redirect(`/listings/${id}`);
}