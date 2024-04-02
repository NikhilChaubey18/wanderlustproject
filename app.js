if(process.env.NODE_ENV != "production"){
  require('dotenv').config()
}




const express = require("express");
const app = express();
const mongoose = require("mongoose");

const path = require("path");// ejs setup
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate"); // help to create templetes like boilerplate

const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");

const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");


//Routers
const listings = require("./routes/listing.js")
const  reviews = require("./routes/review.js")
const  users = require("./routes/user.js")

// const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
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
}

app.set("view engine", "ejs");// ejs setup
app.set("views", path.join(__dirname, "views"));// to find ejs templete
app.use(express.urlencoded({ extended: true }));// to parse a data
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));//  to use a public file

const store = MongoStore.create({
  mongoUrl:dbUrl,
  crypto:{
    secret:process.env.SECRET,
  },
  touchAfter: 24*3600
})

store.on("error", () =>{
  console.log("error in mongo", err)
})


const sessionOptions = {
  store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7*24*60*60*1000,
    maxAge: 7*24*60*60*1000,
    httpOnly:true,
  },
}

// app.get("/", (req, res) =>{
//   res.send("Hi I am root ");
// });

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate())); //authenticate() Generates a function that is used in Passport's LocalStrategy
passport.serializeUser(User.serializeUser());  //serializeUser() Generates a function that is used by Passport to serialize(store memory) users into the session
passport.deserializeUser(User.deserializeUser());  //deserializeUser() Generates a function that is used by Passport to deserialize users into the session




app.use((req,res,next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser= req.user;
  next();
})



//listings

app.use("/listings", listings);


//review


app.use("/listings/:id/reviews", reviews);

app.use("/", users);


  app.post("/listings/:id", (req,res) => {
    req.flash("success", "Booked sucessfully");
    res.redirect(`/listings/${id}`);
  })
 
  


app.all("*", (req, res, next) => {
  next(new ExpressError(404, "page not Found!"));
});

app.use((err, req, res, next) =>{
  let {statusCode = 500, message = "what was i made for"} = err;
  res.status(statusCode).render("error.ejs", {message});
  // res.status(statusCode).send(message);
});


app.listen(8080, () =>{
console.log("server is listening to port 8080");
});
