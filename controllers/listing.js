const Listing = require("../models/listing");

// Index Controller
module.exports.index = async (req, res) => {
  const { search } = req.query;
  let query = {};
  if (search && search.trim() !== "") {
    // Case-insensitive search for title or location
    query = {
      $or: [
        { title: { $regex: search, $options: "i" } },
        { location: { $regex: search, $options: "i" } },
      ],
    };
  }
  const alllistings = await Listing.find(query);
  res.render("listings/index.ejs", { alllistings, search });
};

//New Controller
module.exports.renderNewForm = (req, res) => {
  res.render("listings/New.ejs");
};

//create Controller
module.exports.createListing = async (req, res) => {
  let url = req.file.path;
  let filename = req.file.filename;
  let newList = req.body.listing;
  let newListing = new Listing(newList);
  newListing.owner = req.user._id;
  newListing.image = { url, filename };
  await newListing.save();
  req.flash("success", "New Listing Created!");
  // Redirect to the index page after creating a new listing
  res.redirect("/listings");
};

//show Controller
module.exports.showListing = async (req, res) => {
  let { id } = req.params;
  // Populate reviews for the listing
  let list = await Listing.findById(id)
    .populate({
      path: "reviews",
      populate: {
        path: "author",
      },
    })
    .populate("owner");
  if (!list) {
    req.flash("error", "Cannot find that listing!");
  }

  res.render("listings/show.ejs", { list });
};

//Edit Controller
module.exports.renderEditForm = async (req, res) => {
  let { id } = req.params;
  let list = await Listing.findById(id);
  if (!list) {
    req.flash("error", "Cannot find that listing!");
    return res.redirect("/listings");
  }
  let originalImageUrl = list.image.url; // Store the original image URL
  originalImageUrl = originalImageUrl.replace(
    "/upload",
    "/upload/h_200,w_300,"
  );
  res.render("listings/edit.ejs", { list, originalImageUrl });
};

//update Controller
module.exports.updateListing = async (req, res) => {
  let { id } = req.params;
  let updatedData = req.body.listing;
  let listing = await Listing.findById(id);
  if (!updatedData.image || !updatedData.image.url) {
    // agar image empty hai to purana hi rehne do
    updatedData.image = listing.image;
  }

  await Listing.findByIdAndUpdate(id, updatedData, { runValidators: true });
  if (typeof req.file !== "undefined") {
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = { url, filename };
    await listing.save();
  }
  req.flash("success", "List Updated Successfully!");
  res.redirect(`/listings/${id}`);
};

//Delete Controller

module.exports.deleteListing = async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndDelete(id);
  req.flash("success", "List Deleted Successfully!");
  // Redirect to the index page after deleting the listing
  res.redirect("/listings");
};
