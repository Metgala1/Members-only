const express = require("express");
const path = require("path");
const session = require("express-session");
const flash = require("express-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const layout = require("express-ejs-layouts");
require("dotenv").config();

const app = express();

//My view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(layout);
app.set("layout", "layout");

//My middleware setup
app.use(express.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, "public")));

app.use(session({secret: process.env.SECRET || "cat", resave: false, saveUninitialized: true,}));

app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

app.use((req,res,next) => {
    res.locals.currentUser = req.user;
    next()
})

const indexRouter = require("./routes/index");
app.use("/", indexRouter)

const PORT = process.env.PORT || 300;
app.listen(PORT, () => console.log(`Server running on https:localhost:${PORT}`))