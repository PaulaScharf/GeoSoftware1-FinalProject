// jshint esversion: 8
// jshint maxerr: 1000

"use strict";  // JavaScript code is executed in "strict mode"


/**
* @desc final project, Geosoftware1, SoSe2019
* @author name: Katharina Poppinga, matr.: 450 146; name: Paula Scharf, matr.: 450 334
*/




var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


// get all routes and send them to the secretArea.html
var createController = function (req, res, next) {
  res.render("create");
};

router.get("/create", createController);

// --------------------------------------------------------------------------------------------------------------------
//route handler for getting all created (gps-)routes and sending/rendering them

// get all routes in the database and render them to the overview.ejs
var overviewController = function(req, res) {
  req.db.collection('routeDB').find({}).toArray((error, result) => {
    if(error){
      console.dir(error);
    }
    console.log("show all in list");
    console.log(result);
    //display the overview.ejs page and give it the result
    res.render("overview",{ result });
  });
};

// get all routes in the database and send them back
var displayAllController = function(req, res) {
  req.db.collection('routeDB').find({}).toArray((error, result) => {
    if(error){
      // give a notice, that the reading has failed and show the error-message on the console
      console.log("Failure in reading from 'routeDB'.", error.message);
      console.dir(error);
    }
    else {
      // ... give a notice, that the reading has succeeded and show the result on the console
      console.log("Successfully read the routes from 'routeDB'.", result);
      console.log("display all in map");
      res.json(result);
    }
  });
};

router.get("/overview", overviewController);

router.get("/displayAll", displayAllController);

// --------------------------------------------------------------------------------------------------------------------


module.exports = router;
