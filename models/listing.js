const mongoose = require("mongoose");
const Review = require("./Review.js");

const listingschema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
 image: {
    url: String,
    filename: String,
}
,
  price: Number,
  location: String,
  country: String,
  reviews:[{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Review",
  },
],
  owner:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User",
  }
});

listingschema.post("findOneAndDelete",async(Listing)=>{
   if(Listing){
    await Review.deleteMany({_id:{$in:Listing.reviews}});
   }
});

const Listing = mongoose.model("Listing", listingschema);
module.exports = Listing;
