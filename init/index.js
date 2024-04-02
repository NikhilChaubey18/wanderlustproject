const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");


// const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";/
const dbUrl = process.env.ATLASDB_URL;

main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(dbUrl);
};

const initDB = async () => {
  await Listing.deleteMany({}); // to clean the initial data in a database
  initData.data = initData.data.map((obj) => ({
    ...obj,
    owner: '660a6c188cd695ecc2abe652'
  }));
  await Listing.insertMany(initData.data); // to insert new data where data is key & initData.data likely refers to an array of objects containing data that you want to insert into the Listing collection. Each object in the array represents a document to be inserted
  console.log("data was initialized");
  
};

initDB(); // calling the initDB() function