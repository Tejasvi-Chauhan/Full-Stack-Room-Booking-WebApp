const mongoose=require("mongoose");
const initData=require("./data.js");
const Listing=require("../models/listing.js");


async function main() {
  await mongoose.connect( "mongodb://127.0.0.1:27017/staynest");
}
main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });1


const initDB=async()=>{
    await Listing.deleteMany({});
    initData.data=initData.data.map((obj)=>({...obj,owner:"68a6ad847b82675fe540b1ea"}));
    // console.log(initData);
    await Listing.insertMany(initData.data);
};

initDB();


