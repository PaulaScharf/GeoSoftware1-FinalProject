// jshint esversion: 8
// jshint maxerr: 1000

"use strict";  // JavaScript code is executed in "strict mode"


/**
* @desc final project, Geosoftware1, SoSe2019
* @author name: Katharina Poppinga, matr.: 450 146; name: Paula Scharf, matr.: 450 334
*/



var express = require('express');
var router = express.Router();

const mongodb = require('mongodb');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});



// get all routes and send them to the secretArea.html  ?????????
var createController = function (req, res, next) {
  res.render("create");
};

router.get("/create", createController);


/*
// get ........... ???????
var createAnimalRouteController = function (req, res, next) {
  res.render("createAnimalRoute");
};

router.get("/createAnimalRoute", createAnimalRouteController);
*/



// --------------------------------------------------------------------------------------------------------------------
//route handler for getting all created (gps-)routes and sending/rendering them


// get all routes in the database and send them back
var displayAllController = function(req, res) {
  req.db.collection('routeDB').find({what: "route"}).toArray((error, result) => {
    if(error){
      // give a notice, that the reading has failed and show the error-message on the console
      console.log("Failure in reading from 'routeDB'.", error.message);
      console.dir(error);
    }
    else {
      // ... give a notice, that the reading has succeeded and show the result on the console
      console.log("Successfully read the routes from 'routeDB'.", result);
      res.json(result);
    }
  });
};

// get a single encounter and the corresponding routes and render the singleroute.ejs view with that route
var singleEncounterPageController = function(req, res) {

  console.log("get items " + req.query.e_id + ", " + req.query.r1_id + ", " + req.query.r2_id);
  //
  req.db.collection('routeDB').find({_id: {"$in" : [new mongodb.ObjectID(req.query.e_id),
        new mongodb.ObjectID(req.query.r1_id),
        new mongodb.ObjectID(req.query.r2_id)]}}).toArray((error, result) => {

    if(error){
      // give a notice, that the reading has failed and show the error-message on the console
      console.log("Failure while reading from 'routeDB'.", error.message);
      // in case of an error while reading, do routing to "error.ejs"
      res.render('error');
      // if no error occurs ...
    } else {
      console.log(result);
      //
      res.render("singleEncounter", { result });
    }
  });
};

//
router.get("/displayAll", displayAllController);
//
router.route("/getSingleEncounter")
    .get(singleEncounterPageController);

// --------------------------------------------------------------------------------------------------------------------


module.exports = router;
