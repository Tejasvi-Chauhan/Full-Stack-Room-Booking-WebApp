const express = require("express");
const Router = express.Router();
const User = require("../models/user.js");
const passport = require("passport");
const { savedRedirectUrl } = require("../middleware.js");
const userController = require("../controllers/users.js");
const wrapAsync = require("../utils/wrapAsync.js");


Router.route("/signup")
  // Render Signup Form Route
  .get(userController.renderSignupForm)
  // User Registration Route
  .post(wrapAsync(userController.signup));

Router.route("/login")
  // Render Login Form Route
  .get(userController.renderLoginForm)
  // User Login Route
  .post(
    savedRedirectUrl,
    passport.authenticate("local", {
      failureRedirect: "/login",
      failureFlash: true,
    }),
    userController.login
  );

Router.get("/logout", userController.logout);

module.exports = Router;
