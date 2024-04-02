const Joi = require('joi');

module.exports.listingSchema = joi.object({
    listing: joi.object({
        title: joi.string().require(),
        description:joi.string().require(),
        location:joi.string().require(),
        country:joi.string().require(),
        price:joi.number().require().min(0),
        image: joi.string().allow("",null)
    }).require(),
});


module.exports.reviewSchema = joi.object({
review: joi.object({
    Comment:joi.string().require(),
    rating:joi.number().require().min(1).max(5),
   
}).require(),
})