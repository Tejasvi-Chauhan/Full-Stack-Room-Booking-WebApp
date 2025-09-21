const Review=require("../models/Review");
const Listing = require("../models/listing");

// Create Review Controller
module.exports.createReview = async (req, res) => {
  let listing = await Listing.findById(req.params.id);

  let newReview = new Review(req.body.review);
  newReview.author = req.user._id;

  listing.reviews.push(newReview);
  await newReview.save();
  await listing.save();

  req.flash("success", "Review added successfully! "); // yaha flash set kiya
  res.redirect(`/listings/${listing._id}`);
};


  // Delete Review Controller
  module.exports.deleteReview=async(req, res) => {
  let { id, reviewId } = req.params;
  //  console.log(id,reviewid);
  await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  await Review.findByIdAndDelete(reviewId);
     req.flash("success", "Review deleted successfully!");
  res.redirect(`/listings/${id}`);
};