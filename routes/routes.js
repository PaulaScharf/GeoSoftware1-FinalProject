// jshint esversion: 8
// jshint maxerr: 1000

"use strict";  // JavaScript code is executed in "strict mode"


/**
* @desc final project, Geosoftware1, SoSe2019
* @author name: Katharina Poppinga, matr.: 450 146; name: Paula Scharf, matr.: 450 334
*/

//TODO: write the hidden form elements into these functions


var express = require('express');
const mongodb = require('mongodb');

var router = express.Router();


// ********************************* CRUD-functionality for USER routes: *********************************
// routehandlers for get, post, put, and delete of user routes:
// CREATE and READ can be found in 'index.js'


// *********** UPDATE (with html-form) ***********
// update a route in the database and redirect to the startpage
var putRoutesController = function (req, res) {

  console.log("Update route " + req.body._id);

  // TODO: MÜSSTE DURCH BODY PARSER EIGENTLICH AUTOMATISCH GEHEN, WARUM NICHT? WG. NUR geoJson??
  // convert the coordinate-string to Json
  req.body.geoJson = JSON.parse(req.body.geoJson);

  let objectId = new mongodb.ObjectID(req.body._id);

  // delete the id from the body
  delete req.body._id;

  console.log("Update route" + objectId + "to the following:");
  console.log(req.body);

  // update the route in the database with the id of the req.body (which is given in the form)
  req.db.collection('routeDB').updateOne({_id: objectId}, {$set: req.body}, (error, result) => {

    if (error) {
      // give a notice, that the updating has failed and show the error on the console
      console.log("Failure while updating user route in 'routeDB'.", error);
      // in case of an error while updating, do routing to "error.ejs"
      res.render('error');
      // if no error occurs ...
    } else {
      // ... give a notice, that updating the userroute has succeeded
      console.log("Successfully updated user route in 'routeDB'.");
      // ... and go back to the startpage through the indexRouter
      res.redirect("/");
    }
  });
};


// *********** DELETE (USER- AND ANIMALROUTE) (with html-form) ***********
// delete a route from the database and redirect to the startpage
var deleteRoutesController = function(req, res) {

  //
  let objectId = new mongodb.ObjectID(req.query._id);

  console.log("Delete route " + objectId);

  // delete the route with the given id
  req.db.collection('routeDB').deleteOne({_id:objectId}, (error, result) => {

    if (error) {
      // give a notice, that the deleting has failed and show the error on the console
      console.log("Failure while deleting route from 'routeDB'.", error);
      // in case of an error while deleting, do routing to "error.ejs"
      res.render('error');
      // if no error occurs ...
    } else {
      // ... give a notice, that deleting the route has succeeded
      console.log("Successfully deleted route from 'routeDB'.");
      // ... and go back to the startpage through the indexRouter
      res.redirect("/");
    }
  });
};


// route for updating one userroute (not with update method, because this is not available for html-form)
router.route("/update").post(putRoutesController);
// route for deleting one user- or animalroute (not with delete method, because this is not available for html-form)
router.route("/delete").get(deleteRoutesController);



// ******************************* CRUD-functionality for ANIMAL routes: *********************************

// *********** READ animalroute ***********
// get a single animalroute
var getAnimalController = function(req, res) {

  console.log("Search for already existing animal route.");

  // find animalroute in database with the same study_id and the same individual_id
  // that the user has chosen to insert again (these values come from ajax)
  req.db.collection('routeDB').findOne({
    "study_id" : req.body.study_id,
    "individual_id" : req.body.individual_id
  }, (error, result) => {

    if (error) {
      // give a notice, that the reading has failed and show the error on the console
      console.log("Failure while reading animal route from 'routeDB'.", error);
      // in case of an error while reading, do routing to "error.ejs"
      res.render('error');
      // if no error occurs ...
    } else {
      // ... give a notice, that reading the animalroute has succeeded
      console.log("Successfully read animal route from 'routeDB'.");
      // ... send the result to the ajax request
      res.send(result);
    }
  });
};


// *********** CREATE/insert animalroute ***********
// add an animalroute into the database
var postAnimalController = function(req, res) {

  console.log("Insert animal route " + req.body._id);

  // insert one animalroute into current database
  req.db.collection('routeDB').insertOne(req.body, (error, result) => {

    if (error) {
      // give a notice, that the inserting has failed and show the error on the console
      console.log("Failure while inserting animal route into 'routeDB'.", error);
      // in case of an error while inserting, do routing to "error.ejs"
      res.render('error');
      // if no error occurs ...
    } else {
      // ... give a notice, that inserting the animalroute has succeeded
      console.log("Successfully inserted animal route into 'routeDB'.");
      // ... send the result to the ajax request
      res.send(result);
    }
  });
};


// animalroutes are not allowed to be updated
// for DELETE animalroute see 'deleteRoutesController'

// route for reading/finding one animalroute
router.route("/readAnimal").post(getAnimalController);
// route for creating/inserting one animalroute
router.route("/createAnimal").post(postAnimalController);



// ******************************************* ALL routes: ***********************************************

// get all routes in the database and send them back
var displayAllController = function(req, res) {

  // find all routes in the database
  req.db.collection('routeDB').find({what: "route"}).toArray((error, result) => {

    if (error) {
      // give a notice, that reading all routes from database has failed and show the error on the console
      console.log("Failure in reading all routes from 'routeDB'.", error);
      // in case of an error while reading, do routing to "error.ejs"
      res.render('error');
    }
    // if no error occurs ...
    else {
      // ... give a notice, that reading all routes has succeeded and show the result on the console
      console.log("Successfully read all routes from 'routeDB'.", result);
      // ... and send the result to the ajax request
      res.json(result);
    }
  });
};


// route for reading all routes
router.route("/readAll").get(displayAllController);

// *******************************************************************************************************

module.exports = router;
