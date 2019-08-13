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

// ****************************************************************** CRUD-functionality: ******************************************************************

// routehandler for get, post, put, and delete / using querystring via req.query

// *********** READ/find ***********
// get a single route and render the update.ejs view with that route
var getRoutesController = function(req, res) {

  console.log("get item " + req.query._id);
  //
  req.db.collection('routeDB').find({_id:new mongodb.ObjectID(req.query._id)}).toArray((error, result) => {

    if(error){
      // give a notice, that the reading has failed and show the error-message on the console
      console.log("Failure while reading from 'routeDB'.", error.message);
      // in case of an error while reading, do routing to "error.ejs"
      res.render('error');
      // if no error occurs ...
    } else {
      //
      res.render("update", {result});
    }
  });
};


// *********** CREATE/insert (with html-form) ***********
// add a route from the req.body and redirect to the create.ejs
var postRoutesController = function(req, res) {

  console.log("insert item " + req.body._id);

    // convert the coordinate-string to Json
    req.body.geoJson = JSON.parse(req.body.geoJson);
    // insert one item (one route) into current database
    req.db.collection('routeDB').insertOne(req.body, (error, result) => {

      if (error) {
        console.dir(error);
      }
      // after the item (route) is successfully created, go back to the create-page
      res.render("create")
    });
};


// *********** UPDATE (with html-form) ***********
// update an item in the database and redirect to the startpage
var putRoutesController = function (req, res) {

  console.log("update item " + req.body._id);

  // convert the coordinate-string to Json
  req.body.geoJson = JSON.parse(req.body.geoJson);
  //
  req.body.status = "updated";
  let objectId = new mongodb.ObjectID(req.body._id);
  // delete the id from the body
  delete req.body._id;

  console.log("update item" + objectId + "to the following:")
  console.log(req.body);

  // update the item in the db with the  id of the req.body (which is given in the form)
  req.db.collection('routeDB').updateOne({_id:objectId}, {$set: req.body}, (error, result) => {

    if(error){
      console.dir(error);
    }
    // go back to the startpage through the indexRouter
    res.redirect("/");
  });
};


// *********** DELETE ***********
// delete an item from the database and redirect to the startpage
var deleteRoutesController = function(req, res) {

  console.log("delete item " + req.query._id);
  //
  let objectId = new mongodb.ObjectID(req.query._id);

  console.log(objectId);
  // delete the item with the given id
  req.db.collection('routeDB').deleteOne({_id:objectId}, (error, result) => {

    if(error){
      console.dir(error);
    }
  });
  // go back to the startpage through the indexRouter
  res.redirect("/");
};



// *********** CREATE/insert animalroute ***********
// add an animalroute from the req.body and redirect to createAnimalRoute.ejs
var postAnimalController = function(req, res) {

  console.log("insert animalroute");

  console.log(req.body);

  //
  req.body.geoJson = JSON.parse(req.body.geoJson);

  // insert one item (one animalroute) into current database
  req.db.collection('routeDB').insertOne(req.body, (error, result) => {

    if (error) {
      console.dir(error);
    }
    // after the item (animalroute) is successfully created, go back to the createAnimalRoute-page
    //res.render("createAnimalRoute");
    res.send(result);
  });
};

// **********************************************************************

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



// routes for get and create
router.route("/read")
    .get(getRoutesController);
router.route("/create")
    .post(postRoutesController);

// routes for delete and update (we could not use the update and delete methods,
// because they are not available for html-forms)
router.route("/delete")
    .get(deleteRoutesController);
router.route("/update")
    .post(putRoutesController);

// routes for animal.....
router.route("/createAnimal")
    .post(postAnimalController);

//
router.get("/readAll", displayAllController);


module.exports = router;
