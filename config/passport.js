const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");
const { findUserByUsername, findUserById } = require("../models/user");

function initialize(passport) {
  const authenticateUser = async (username, password, done) => {
    try {
      const user = await findUserByUsername(username);
      if (!user) {
        return done(null, false, { message: "No user with that username" });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (isMatch) {
        return done(null, user);
      } else {
        return done(null, false, { message: "Password incorrect" });
      }
    } catch (err) {
      return done(err);
    }
  };

  passport.use(new LocalStrategy( { usernameField: "email" },authenticateUser));

  passport.serializeUser((user, done) => done(null, user.id));

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await findUserById(id);
      done(null, user);
    } catch (err) {
      done(err);
    }
  });
}

module.exports = initialize;
