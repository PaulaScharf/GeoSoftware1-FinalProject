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

// ****************************************************************** CRUD-functionality: ******************************************************************

// routehandler for get, post, put, and delete / using querystring via req.query

// *********** READ/find ***********
// get a single route and render the singleRoute.ejs view with that route
var getitemcontroller = function(req, res) {
  console.log("get item " + req.query._id);
  req.db.collection('routeDB').find({_id:new mongodb.ObjectID(req.query._id)}).toArray((error, result) => {
    if(error){
      // give a notice, that the reading has failed and show the error-message on the console
      console.log("Failure while reading from 'routeDB'.", error.message);
      // in case of an error while reading, do routing to "error.ejs"
      res.render('error');
      // if no error occurs ...
    } else {
      res.render("singleRoute", {result});
    }
});
};

// *********** CREATE/insert (with html-form) ***********
// add a route from the req.body and redirect to the create.html
var postitemcontroller = function(req, res) {
  console.log("insert item " + req.body._id);
  // your only able to add an item if it contains atleast the route-coordinates and a name
  if(req.body.geoJson != '' && req.body.name != '') {
    // convert the coordinate-string to Json
    req.body.geoJson = JSON.parse(req.body.geoJson);
    // insert one item (one route) into current database
    req.db.collection('routeDB').insertOne(req.body, (error, result) => {
      if (error) {
        console.dir(error);
      }
      // after the item (route) is successfully created go back to the create-page
      res.render("create")
    });
  }
  else {
    // If the item did not comply go back to the create-page (to try again)
    res.render("create");
  }
};

// *********** UPDATE (with html-form) ***********
// update an item in the database and redirect to the overview.ejs
var putitemcontroller = function (req, res) {
  console.log("update item " + req.body._id);
  // convert the coordinate-string to Json
  req.body.geoJson = JSON.parse(req.body.geoJson);
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
    // go back to the overview-page through the indexRouter
    res.redirect("/overview");
});
};

// *********** DELETE ***********
// delete an item from the database and redirect to the overview.ejs
var deleteitemcontroller = function(req, res) {
  console.log("delete item " + req.query._id);
  let objectId = new mongodb.ObjectID(req.query._id);
  console.log(objectId);
  // delete the item with the given id
  req.db.collection('routeDB').deleteOne({_id:objectId}, (error, result) => {
    if(error){
      console.dir(error);
    }
  });
  // go back to the overview-page through the indexRouter
  res.redirect("/overview");
};

// routes for get and create
router.route("/")
    .get(getitemcontroller)
    .post(postitemcontroller);

// routes for delete and update (we could'nt use the update and delete methods,
// because they are not available for html-forms)
router.route("/single")
    .get(deleteitemcontroller)
    .post(putitemcontroller);


module.exports = router;
