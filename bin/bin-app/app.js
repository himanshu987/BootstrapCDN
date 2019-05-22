var express = require("express");
var path = require("path");
var mongoose = require("mongoose");
var config = require("./config/database");
var bodyParser = require("body-parser");
var session = require("express-session");
var expressValidator = require("express-validator");
var fileUpload = require("express-fileupload");
var passport = require("passport");

// Connect to db
mongoose.connect(config.database);
var db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function() {
  console.log("Connected to MongoDB");
});

// Init app
var app = express();

// View engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// Set public folder
app.use(express.static(path.join(__dirname, "public")));

// Set global errors variable
app.locals.errors = null;

// Express fileUpload middleware
app.use(fileUpload());

// Body Parser middleware
//
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

// Express Session middleware
app.use(
  session({
    secret: "keyboard cat",
    resave: true,
    saveUninitialized: true
    //  cookie: { secure: true }
  })
);

// Express Validator middleware
app.use(
  expressValidator({
    errorFormatter: function(param, msg, value) {
      var namespace = param.split("."),
        root = namespace.shift(),
        formParam = root;

      while (namespace.length) {
        formParam += "[" + namespace.shift() + "]";
      }
      return {
        param: formParam,
        msg: msg,
        value: value
      };
    }
  })
);

// Express Messages middleware
app.use(require("connect-flash")());
app.use(function(req, res, next) {
  res.locals.messages = require("express-messages")(req, res);
  next();
});

// Passport Config
require("./config/passport")(passport);
// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

app.get("*", function(req, res, next) {
  res.locals.cart = req.session.cart;
  res.locals.user = req.user || null;
  next();
});

var users = require("./routes/users.js");
var contact = require("./routes/contact.js");

app.use("/contact", contact);
app.use("/", users);

// app.use('/',);

// Start the server
var port = 3000;
app.listen(port, function() {
  console.log("Server started on port " + port);
});
