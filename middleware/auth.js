module.exports = ensureAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  req.flash("error", "You must be logged in to view that page.");
  res.redirect("/log-in");
};
//we use this code to check if user is authenticated 