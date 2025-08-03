 const bcrypt = require("bcryptjs");
 const {body, validationResult} = require("express-validator")
const { createUser, findUserByUsername } = require("../models/user");
const passport = require("passport")

exports.sign_up_get = ((req,res) => {
    res.render("sign-up", {title: "Sign Up"})
})

exports.sign_up_post = [
  // Validate and sanitize input
  body("username")
    .trim()
    .isLength({ min: 3 }).withMessage("Username must be at least 3 characters")
    .escape(),
  body("first_name").trim().notEmpty().withMessage("First name is required").escape(),
  body("last_name").trim().notEmpty().withMessage("Last name is required").escape(),
  body("email").trim().isEmail().withMessage("Invalid email").normalizeEmail(),
  body("password")
    .isLength({ min: 5 }).withMessage("Password must be at least 5 characters"),
  body("confirmPassword")
    .custom((value, { req }) => value === req.body.password)
    .withMessage("Passwords do not match"),

  async (req, res, next) => {
    const errors = validationResult(req);
    const { username, first_name, last_name, email, password } = req.body;

    if (!errors.isEmpty()) {
      req.flash("error", errors.array().map(err => err.msg));
      return res.redirect("/sign-up");
    }

    try {
      const existingUser = await findUserByUsername(username);
      if (existingUser) {
        req.flash("error", "Username is already taken.");
        return res.redirect("/sign-up");
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      await createUser({
        username,
         password: hashedPassword,
        first_name,
        last_name,
        email,
      });

      req.flash("success", "Account created! You can now log in.");
      res.redirect("/log-in");
    } catch (err) {
      next(err);
    }
  }
];


exports.log_in_get = (req,res) => {
    res.render("log-in", {title: "Log In"})
}

exports.log_in_post = passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "/log-in",
  failureFlash: true,
});
