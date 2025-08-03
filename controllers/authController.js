 const bcrypt = require("bcryptjs");
 const {body, validationResult} = require("express-validator")
const { createUser, findUserByUsername } = require("../models/user");
const passport = require("passport");
const pool = require("../models/db")
const path = require("path")
require("dotenv").config({
  path: path.resolve(__dirname, "..", ".env"),
});

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
        hashedPassword,
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

exports.log_out_get = (req, res, next) => {
  req.logout(err => {
    if (err) return next(err);
    req.flash("success", "You have been logged out.");
    res.redirect("/");
  });
};

exports.membership_get = (req,res) => {
    res.render("membership", {title: "Become a member"})
}

exports.membership_post = [
  body("secretCode")
    .trim()
    .custom((value, { req }) => {
      console.log("Submitted code:", value);
      console.log("Secret from env:", process.env.SECRET);
      if (value !== process.env.SECRET) {
        throw new Error("Incorrect membership code");
      }
      return true;
    }),

  async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      req.flash("error", errors.array().map((err) => err.msg));
      return res.redirect("/membership");
    }

    try {
      const userId = req.user.id;
      await pool.query("UPDATE users SET is_member = true WHERE id = $1", [userId]);

      req.flash("success", "You are now a member!");
      res.redirect("/");
    } catch (err) {
      next(err);
    }
  },
];

