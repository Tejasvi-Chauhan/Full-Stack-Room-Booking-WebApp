const Listing=require("./models/listing.js");
const Review=require("./models/Review.js");
const { listingschema,reviewSchema } = require("./views/schema.js");
const ExpressError = require("./utils/ExpressError.js");

module.exports.isLoggedIn=(req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl=req.originalUrl;
        req.flash("error","You must be logged in to do that");
        return res.redirect("/login");
    }
    next();
};

module.exports.savedRedirectUrl = (req, res, next) => {
  if (req.session.redirectUrl) {
    let redirectUrl = req.session.redirectUrl;

    // Agar redirect url review ke POST/DELETE route ka hai
    if (redirectUrl.includes("/reviews/") || redirectUrl.endsWith("/reviews")) {
      // Sirf "/listings/:id" tak redirect karo
      redirectUrl = redirectUrl.split("/reviews")[0];
    }

    res.locals.redirectUrl = redirectUrl;
    delete req.session.redirectUrl;
  } else {
    res.locals.redirectUrl = "/listings";
  }
  next();
};


module.exports.isOwner=async(req,res,next)=>{
      let { id } = req.params;
    let listing=await Listing.findById(id);
    if(!listing.owner._id.equals(res.locals.currentUser._id)){
      req.flash("error","You do not have permission to do that!");
      return res.redirect(`/listings/${id}`);
    }
    next();
}

module.exports.validatelisting=(req,res,next)=>{
  let { error } = listingschema.validate(req.body);
  if (error) {
    throw new ExpressError(400, error);
  } else {
    next();
  }
};


module.exports.validatereview = (req, res, next) => {
  let { error } = reviewSchema.validate(req.body);
  if (error) {
    throw new ExpressError(400, error);
  } else {
    next();
  }
};

module.exports.isReviewAuthor=async(req,res,next)=>{
      let {id, reviewId } = req.params;
   
    let review=await Review.findById(reviewId);
    if(!review.author.equals(res.locals.currentUser._id)){

      req.flash("error","You are not the author of this review!");
      return res.redirect(`/listings/${id}`);
    }
    next();
};


