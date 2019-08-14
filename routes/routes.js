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

// *********** READ ***********
// get a single route and render the update.ejs view with that route
var getRoutesController = function(req, res) {

  console.log("Get route " + req.query._id);
  //
  req.db.collection('routeDB').find({_id: new mongodb.ObjectID(req.query._id)}).toArray((error, result) => {

    if (error) {
      // give a notice, that the reading has failed and show the error on the console
      console.log("Failure while reading userroute from 'routeDB'.", error);
      // in case of an error while reading, do routing to "error.ejs"
      res.render('error');
      // if no error occurs ...
    } else {
      // ... give a notice, that reading the userroute has succeeded
      console.log("Successfully read userroute from 'routeDB'.");
      // ... and go to the update-page (with taking along the result/the route)
      res.render("update", {result});
    }
  });
};


// *********** CREATE/insert (with html-form) ***********
// add a route from the req.body and redirect to the create.ejs
var postRoutesController = function(req, res) {

  console.log("Insert route " + req.body._id);

  // TODO: MÜSSTE DURCH BODY PARSER EIGENTLICH AUTOMATISCH GEHEN, WARUM NICHT?????
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


// *********** UPDATE (with html-form) ***********
// update a route in the database and redirect to the startpage
var putRoutesController = function (req, res) {

  console.log("Update route " + req.body._id);

  // TODO: MÜSSTE DURCH BODY PARSER EIGENTLICH AUTOMATISCH GEHEN, WARUM NICHT?????
  // convert the coordinate-string to Json
  req.body.geoJson = JSON.parse(req.body.geoJson);
  //
  req.body.status = "updated";

  let objectId = new mongodb.ObjectID(req.body._id);
  // TODO: SICHER NÖTIG?
  // delete the id from the body
  delete req.body._id;

  console.log("Update route" + objectId + "to the following:")
  console.log(req.body);

  // update the route in the database with the id of the req.body (which is given in the form)
  req.db.collection('routeDB').updateOne({_id: objectId}, {$set: req.body}, (error, result) => {

    if (error) {
      // give a notice, that the updating has failed and show the error on the console
      console.log("Failure while updating userroute in 'routeDB'.", error);
      // in case of an error while updating, do routing to "error.ejs"
      res.render('error');
      // if no error occurs ...
    } else {
      // ... give a notice, that updating the userroute has succeeded
      console.log("Successfully updated userroute in 'routeDB'.");
      // ... and go back to the startpage through the indexRouter
      res.redirect("/");
    }
  });
};


// *********** DELETE (USER- AND ANIMALROUTE) (with html-form) ***********
// delete a route from the database and redirect to the startpage
var deleteRoutesController = function(req, res) {

  console.log("Delete route " + req.query._id);

  //
  let objectId = new mongodb.ObjectID(req.query._id);

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


// route for reading one userroute
router.route("/read").get(getRoutesController);

// route for creating/inserting one userroute
router.route("/create").post(postRoutesController);

// route for updating one userroute (not with update method, because this is not available for html-form)
router.route("/update").post(putRoutesController);

// route for deleting one user- or animalroute (not with delete method, because this is not available for html-form)
router.route("/delete").get(deleteRoutesController);


// *******************************************************************************************************


// ******************************* CRUD-functionality for ANIMAL routes: *********************************

// *********** READ animalroute ***********
// get a single animalroute
var getAnimalController = function(req, res) {

  console.log("Find animalroute " + req.query._id);
/*  //
  req.db.collection('routeDB').findOne({_id: new mongodb.ObjectID(req.query._id)}).((error, result) => {

    if (error) {
      // give a notice, that the reading has failed and show the error on the console
      console.log("Failure while reading animalroute from 'routeDB'.", error);
      // in case of an error while reading, do routing to "error.ejs"
      res.render('error');
      // if no error occurs ...
    } else {
      // ... give a notice, that reading the animalroute has succeeded
      console.log("Successfully read animalroute from 'routeDB'.");
      // ... send the result to the ajax request
      res.send(result);
    }
  });*/
};


// *********** CREATE/insert animalroute ***********
// add an animalroute into the database
var postAnimalController = function(req, res) {

  console.log("Insert animalroute " + req.body._id);

  // insert one animalroute into current database
  req.db.collection('routeDB').insertOne(req.body, (error, result) => {

    if (error) {
      // give a notice, that the inserting has failed and show the error on the console
      console.log("Failure while inserting animalroute into 'routeDB'.", error);
      // in case of an error while inserting, do routing to "error.ejs"
      res.render('error');
      // if no error occurs ...
    } else {
      // ... give a notice, that inserting the animalroute has succeeded
      console.log("Successfully inserted animalroute into 'routeDB'.");
      // ... send the result to the ajax request
      res.send(result);
    }
  });
};


// animalroutes are not allowed to be updated

// for DELETE animalroute see 'deleteRoutesController'


// route for reading/finding one animalroute
router.route("/readAnimal").get(getAnimalController);

// route for creating/inserting one animalroute
router.route("/createAnimal").post(postAnimalController);

// *******************************************************************************************************


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
