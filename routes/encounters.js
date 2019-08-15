// jshint esversion: 8
// jshint maxerr: 1000

"use strict";  // JavaScript code is executed in "strict mode"


/**
* @desc final project, Geosoftware1, SoSe2019
* @author name: Katharina Poppinga, matr.: 450 146; name: Paula Scharf, matr.: 450 334
*/



var express = require('express');
const mongodb = require('mongodb');

var router = express.Router();


// ********************************* CRUD-functionality for encounters: *********************************


// *********** READ ***********
// get all encounters
//
var getAllEncountersController = function(req,res) {
  //
  req.db.collection('routeDB').find({what: "encounter"}).toArray((error, result) => {

    if (error) {
      // give a notice, that reading all encounters has failed and show the error on the console
      console.log("Failure in reading all encounters from 'routeDB'.", error);
      // in case of an error while reading, do routing to "error.ejs"
      res.render('error');
      // if no error occurs ...
    }
    else {
      // ... give a notice, that the reading has succeeded and show the result on the console
      console.log("Successfully read the encounters from 'routeDB'.");
      // ... and send the result to the ajax request
      res.json(result);
    }
  });
};


// *********** CREATE/insert ***********
// add an encounter from the req.body
var postEncounterController = function(req, res) {

  console.log("Insert encounter");

  // insert one encounter into current database
  req.db.collection('routeDB').insertOne(req.body, (error, result) => {

    if (error) {
      // give a notice, that the inserting has failed and show the error on the console
      console.log("Failure while inserting encounter into 'routeDB'.", error);
      // in case of an error while inserting, do routing to "error.ejs"
      res.render('error');
      // if no error occurs ...
    } else {
      // ... give a notice, that inserting the encounter has succeeded
      console.log("Successfully inserted encounter " + result.insertedId + " into 'routeDB'.");
      res.send(result.insertedId);
    }
  });
};


// *********** UPDATE ***********
// update an encounter in the database
var putEncounterController = function (req, res) {

  console.log("Update encounter " + req.body._id);

  //
  let objectId = new mongodb.ObjectID(req.body._id);
  // TODO: SICHER NÖTIG?
  // delete the id from the body
  delete req.body._id;

  console.log("Update an item " + objectId + " to the following:")
  console.log(req.body);

  // update the encounter in the database with the id of the req.body
  req.db.collection('routeDB').updateOne({_id:objectId}, {$set: req.body}, (error, result) => {

    if (error) {
      // give a notice, that the updating has failed and show the error on the console
      console.log("Failure while updating an item in 'routeDB'.", error);
      // in case of an error while updating, do routing to "error.ejs"
      res.render('error');
      // if no error occurs ...
    } else {
      // ... give a notice, that updating the encounter has succeeded
      console.log("Successfully updated an item in 'routeDB'.");
      // ... and ??????
      res.send();
    }
  });
};


// *********** DELETE ***********
// delete an encounter from the database and .............
var deleteEncounterController = function(req, res) {

  console.log("Delete encounter " + req.query._id);

  //
  let objectId = new mongodb.ObjectID(req.query._id);

  // delete the encounter with the given id
  req.db.collection('routeDB').deleteOne({_id:objectId}, (error, result) => {

    if(error){
      // give a notice, that the deleting has failed and show the error on the console
      console.log("Failure while deleting encounter from 'routeDB'.", error);
      // in case of an error while deleting, do routing to "error.ejs"
      res.render('error');
      // if no error occurs ...
    } else {
      // ... give a notice, that deleting the encounter has succeeded
      console.log("Successfully deleted encounter from 'routeDB'.");
      // ... and ????
      res.send();
    }
  });
};


// route for reading all encounters
router.route("/readAll").get(getAllEncountersController);
// route for creating/inserting one encounter
router.route("/create").post(postEncounterController);
// route for updating one encounter
router.route("/update").post(putEncounterController);
// route for deleting one encounter
router.route("/delete").get(deleteEncounterController);

// *******************************************************************************************************

module.exports = router;
