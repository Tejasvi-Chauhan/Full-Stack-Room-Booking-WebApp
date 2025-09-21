if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const app = express();
const path = require("path");
const ejsMate = require("ejs-mate");
const { listingschema, reviewSchema } = require("./views/schema.js");
const methodOverride = require("method-override");
const mongoose = require("mongoose");
const listings = require("./routes/listing.js");
const reviewroutes = require("./routes/review.js");
const userRoutes = require("./routes/user.js");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport");
const localStrategy = require("passport-local");
const User = require("./models/user.js");
const { createSecretKey } = require("crypto");
const port = 8080;

// Connect to MongoDB
const dbURL = process.env.ATLASDB_URI;
async function main() {
  await mongoose.connect(dbURL);
}

main()
  .then(() => {
    console.log("Connected");
  })
  .catch((err) => {
    console.log(err);
  });

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.engine("ejs", ejsMate);
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "/public")));

const store = MongoStore.create({
  mongoUrl: dbURL,
  touchAfter: 24 * 60 * 60, // time period in seconds
  crypto: {
    secret: process.env.SECRET,
  },
});

store.on("error", function (e) {
  console.log("ERROR in MONGO SESSION STORE", e);
});

const sessionOptions = {
  store: store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true, // Helps prevent XSS attacks
  },
};

app.use(session(sessionOptions));
app.use(flash());
app.use(passport.initialize());
// Use the local strategy for authentication
app.use(passport.session());
// web application needs the ability to identify users as they browse from page to page. This series of requests and responses , each associated with a same user, is called a session.
passport.use(new localStrategy(User.authenticate()));
//  To authenticate the user we use the localstartegy , and use .authenticate method of the User model to verify the username and password.

passport.serializeUser(User.serializeUser());
// This method is called when a user logs in, and it stores the user ID in the session.
passport.deserializeUser(User.deserializeUser());
// This method is called on every request to retrieve the user from the session using the stored user ID.
// app.get("/", (req, res) => {
//   res.send("Working");
// });

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currentUser = req.user; // Make the current user available in all views
  next();
});

app.use("/listings", listings);
app.use("/listings/:id/reviews", reviewroutes);
app.use("/", userRoutes);

// Redirect homepage to listings
app.get("/", (req, res) => {
  res.redirect("/listings");
});

// Catch-all for undefined routes
app.all("*", (req, res) => {
  res.redirect("/listings");
});

app.listen(port, () => {
  console.log(`App is listening at ${port}`);
});

app.use((err, req, res, next) => {
  let { status = 401, message = "Something went wrong" } = err;
  res.status(status).render("error.ejs", { err });
});
