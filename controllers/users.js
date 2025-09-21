const User = require("../models/user");
const sendTelegramMessage = require("../BotTelegram.js");

// Render Signup Form Controller
module.exports.renderSignupForm = (req, res) => {
  res.render("users/signup.ejs");
};

// User Registration Controller
module.exports.signup = async (req, res) => {
  // This route handles user registration
  try {
    let { username, email, password } = req.body;
    // console.log(req.body);
    const newuser = new User({ username, email });
    const registereduser = await User.register(newuser, password);
    // console.log(registereduser);
    // After registering the user, we log them in automatically
    // req.login is used to log in the user after registration
    // This will create a session for the user
    // and allow them to access protected routes immediately
    // req.login is a Passport.js method that logs in the user
    // It takes the user object and a callback function
    // The callback function is called after the user is logged in
    // If there's an error during login, it will be passed to the next middleware
    // If login is successful, we redirect the user to the listings page
    // and flash a success message
    req.login(registereduser, (err) => {
      if (err) {
        return next(err);
      }
      //
      sendTelegramMessage(`New User Signed Up:

        E-mail= ${registereduser.email}
        UserName= ${registereduser.username}
        
        at ${new Date().toLocaleString()}`);
      req.flash("success", "User registered successfully");
      res.redirect("/listings");
    });
  } catch (err) {
    req.flash("error", err.message);
    res.redirect("/signup");
  }
};

// Render Login Form Controller
module.exports.renderLoginForm = (req, res) => {
  res.render("users/login.ejs");
};

//login Controller
module.exports.login = async (req, res) => {
  // This route handles user login
  try {
    // Flash message
    req.flash("success", "Welcome back!");

    // Online flag set karo
    const user = await User.findById(req.user._id);
    user.online = true;
    user.lastLogin = new Date();
    await user.save();

    // Telegram notification
    sendTelegramMessage(
      `User Logged In: User Name:${
        user.username
      }  at ${new Date().toLocaleString()}`
    );

    // Redirect
    res.redirect(res.locals.redirectUrl);
  } catch (err) {
    console.log(err);
    req.flash("error", "Something went wrong during login");
    res.redirect("/login");
  }
};
//logout Controller
module.exports.logout = async (req, res, next) => {
  // This route handles user logout
  try {
    if (req.user) {
      const user = await User.findById(req.user._id);
      if (user) {
        user.online = false;
        await user.save();
        sendTelegramMessage(
          `User Logged Out: User Name:${user.username}
        at ${new Date().toLocaleString()}`
        );
      }
    }

    req.logout((err) => {
      if (err) return next(err);
      req.flash("success", "Logged out successfully");
      res.redirect("/listings");
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
};
