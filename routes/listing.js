const express = require("express");
const Router = express.Router();
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedIn, isOwner, validatelisting } = require("../middleware.js");
const listingController = require("../controllers/listing.js");
const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });

Router.route("/")
  //Index Route
  .get(wrapAsync(listingController.index))
  //Create Route
  .post(
    isLoggedIn,
    upload.single("listing[image]"),
    validatelisting,
    wrapAsync(listingController.createListing)
  );

// New Route
Router.get("/new", isLoggedIn, listingController.renderNewForm);

Router.route("/:id")
  //Show Route
  .get(wrapAsync(listingController.showListing))
  //Update Route
  .put(
    isLoggedIn,
    isOwner,
    upload.single("listing[image]"),
    validatelisting,
    wrapAsync(listingController.updateListing)
  )
  //Delete Route
  .delete(isLoggedIn, isOwner, wrapAsync(listingController.deleteListing));

//Edit Route
Router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.renderEditForm)
);

module.exports = Router;
