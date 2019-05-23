var express = require("express");
var router = express.Router();
// var mongo = require('mongodb').MongoClient;
// var objectId = require('mongodb').ObjectID;
// var assert = require('assert');

// var url = 'mongodb://localhost:27017/csmcart';

// TO GET THE DATA FROM THE DATABASE

// router.get('/get-data', function(req, res, next) {
//   var resultArray = [];
//   mongo.connect(url, function(err, db) {
//     assert.equal(null, err);
//     var cursor = db.collection('user-data').find();
//     cursor.forEach(function(doc, err) {
//       assert.equal(null, err);
//       resultArray.push(doc);
//     }, function() {
//       db.close();
//       res.render('index', {items: resultArray});
//     });
//   });
// });

var Contact = require("../models/contact");

router.get("/", function(req, res) {
  var username = "";
  var email = "";
  var phone = "";
  var content = "";

  res.render("contact-us", {
    username: username,
    email: email,
    phone: phone,
    content: content
  });
});

router.post("/", function(req, res) {
  req.checkBody("username", "Title must have a value.").notEmpty();
  req.checkBody("email", "Content must have a value.").notEmpty();
  req.checkBody("phone", "Content must have a value.").notEmpty();
  req.checkBody("content", "Content must have a value.").notEmpty();

  var username = req.body.username;
  // var slug = req.body.slug.replace(/\s+/g, '-').toLowerCase();
  // if (slug == "")
  //     slug = username.replace(/\s+/g, '-').toLowerCase();
  var email = req.body.email;
  var phone = req.body.phone;
  var content = req.body.content;

  var errors = req.validationErrors();

  if (errors) {
    res.render("admin/add_page", {
      errors: errors,
      username: username,
      email: email,
      phone: phone,
      content: content
    });
  } else {
    Contact.findOne({ username: username }, function(err, contact) {
      if (contact) {
        req.flash("danger", "Contact username exists, choose another.");
        res.render("/contact", {
          username: username,
          email: email,
          phone: phone,
          content: content
        });
      } else {
        var contact = new Contact({
          username: username,
          email: email,
          phone: phone,
          content: content
        });

        contact.save(function(err) {
          if (err) return console.log(err);
          req.flash("success", "Contact added!");
          res.redirect("/");
        });
      }
    });
  }
});

// Exports
module.exports = router;
