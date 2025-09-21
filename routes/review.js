const express = require("express");
const Router = express.Router({ mergeParams: true });
const Listing = require("../models/listing.js");
const Review = require("../models/Review.js");
const wrapAsync = require("../utils/wrapAsync.js");
const { validatereview, isLoggedIn, isReviewAuthor } = require("../middleware.js");
const reviewController = require("../controllers/reviews.js");


// -------------------- POST Route for Reviews--------------

Router.post(
  "/",
  isLoggedIn,
  validatereview,
  wrapAsync(reviewController.createReview)
);

Router.delete("/:reviewId",isLoggedIn,isReviewAuthor, wrapAsync(reviewController.deleteReview)
);

module.exports = Router;
