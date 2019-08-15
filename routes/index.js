// jshint esversion: 8
// jshint maxerr: 1000

"use strict";  // JavaScript code is executed in "strict mode"


/**
* @desc final project, Geosoftware1, SoSe2019
* @author name: Katharina Poppinga, matr.: 450 146; name: Paula Scharf, matr.: 450 334
*/


// TODO: KOMMENTARE zuende schreiben


var express = require('express');
const mongodb = require('mongodb');

var router = express.Router();


// getting the homepage
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


// TODO: IN ROUTES.JS SCHREIBEN?
//
var createController = function (req, res, next) {
  res.render("create");
};


// TODO: IN ROUTES.JS SCHREIBEN?
//
var createAnimalRouteController = function (req, res, next) {
  res.render("createAnimalRoute");
};


// ******************************* one enounter and its corresponding routes *******************************

// *********** READ ***********
// get a single encounter and the corresponding routes and render the singleroute.ejs view with that route
var singleEncounterPageController = function(req, res) {

  console.log("Get items " + req.query.e_id + ", " + req.query.r1_id + ", " + req.query.r2_id);

  //
  req.db.collection('routeDB').find({_id: {"$in" : [new mongodb.ObjectID(req.query.e_id),
    new mongodb.ObjectID(req.query.r1_id),
    new mongodb.ObjectID(req.query.r2_id)]}}).toArray((error, result) => {

      if (error) {
        // give a notice, that reading one enounter and its corresponding routes has failed and show the error on the console
        console.log("Failure in reading encounter and corresponding routes from 'routeDB'.", error);
        // in case of an error while reading, do routing to "error.ejs"
        res.render('error');
        // if no error occurs ...
      } else {
        // ... give a notice, that reading one enounter and its corresponding routes has succeeded and show the result on the console
        console.log("Successfully read all routes from 'routeDB'.", result);
        // ... and render singleroute.ejs view with the enounter and its corresponding routes
        res.render("singleEncounter", { result });
      }
    });
  };

// *********** CREATE/insert (with html-form) ***********
// add a route from the req.body and redirect to the create.ejs
var postRoutesController = function(req, res) {

  console.log("Insert route " + req.body._id);

  // TODO: MÜSSTE DURCH BODY PARSER EIGENTLICH AUTOMATISCH GEHEN, WARUM NICHT? WG. NUR geoJson??
  // convert the coordinate-string to Json
  req.body.geoJson = JSON.parse(req.body.geoJson);

  // insert one item (one route) into current database
  req.db.collection('routeDB').insertOne(req.body, (error, result) => {

    if (error) {
      // give a notice, that the inserting has failed and show the error on the console
      console.log("Failure while inserting userroute into 'routeDB'.", error);
      // in case of an error while inserting, do routing to "error.ejs"
      res.render('error');
      // if no error occurs ...
    } else {
      // ... give a notice, that inserting the userroute has succeeded
      console.log("Successfully inserted userroute into 'routeDB'.");
      // ... and go back to the create-page
      res.render("create");
    }
  });
};


  // *******************************************************************************************************

  //
  router.route("/create").get(createController);
  //
  router.route("/createAnimalRoute").get(createAnimalRouteController);

  // route for reading one encounter and its corresponding routes
  router.route("/getSingleEncounter").get(singleEncounterPageController);
// route for creating/inserting one userroute
router.route("/create").post(postRoutesController);

  // *******************************************************************************************************

  module.exports = router;
