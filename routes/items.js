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

// --------------------------------------------------------------------------------------------------------------------
// routehandler for get, post, put, and delete / using querystring via req.query

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

// add a route from the req.body and redirect to the create.html
var postitemcontroller = function(req, res) {
  console.log(req.body);
  if(req.body.geoJson != '' && req.body.name != '') {
    req.body.geoJson = JSON.parse(req.body.geoJson);
    console.log("insert item " + req.body._id);
    req.db.collection('routeDB').insertOne(req.body, (error, result) => {
      if (error) {
        console.dir(error);
      }
      res.render("create")
    });
  }
  else {
    res.render("create");
  }
};

// update an item in the database and redirect to the overview.ejs
var putitemcontroller = function (req, res) {
  console.log("update item " + req.body._id);
  req.body.geoJson = JSON.parse(req.body.geoJson);
  let id = req.body._id;
  delete req.body._id;
  console.log(req.body); // => { name:req.body.name, description:req.body.description }
  req.db.collection('routeDB').updateOne({_id:new mongodb.ObjectID(id)}, {$set: req.body}, (error, result) => {
    if(error){
      console.dir(error);
    }
    res.redirect("/overview");
});
};

// delete an item from the database and redirect to the overview.ejs
var deleteitemcontroller = function(req, res) {
  console.log("delete item " + req.query._id);
  let objectId = new mongodb.ObjectID(req.query._id);
  console.log(objectId);
  req.db.collection('routeDB').deleteOne({_id:objectId}, (error, result) => {
    if(error){
      console.dir(error);
    }
  });
  res.redirect("/overview");
};
router.route("/")
    .get(getitemcontroller)
    .post(postitemcontroller);

router.route("/single")
    .get(deleteitemcontroller)
    .post(putitemcontroller);































/*
// *********** CREATE/insert (with html-form) ***********

// HTTP POST request for inserting ONE route into current database 'routeDB'
router.post("/api/createRoute", (req, res) => {

  // tell the user about inserting route into current database 'routeDB'
  console.log("Insert route to current database 'routeDB':");

  // insert one item (one route) into current database 'routeDB'
  app.locals.db.collection('routeDB').insertOne(req.body, (error, result) => {

    //
    if (error) {
      // give a notice, that the inserting has failed and show the error-message on the console
      console.log("Failure in inserting into 'routeDB'.", error.message);

      // in case of an error while inserting, do routing to "crudError.html"
      res.redirect('/crudError.html');

      // if no error occurs ...
    } else {
      // .. give a notice, that the inserting has succeeded and show the result on the console
      console.log("Successfully inserted into 'routeDB'.", result);

      // .. routing to "routeCreator.html" at the end of inserting
      res.redirect('/routeCreator.html');
    }
  });
});




// *********** READ/find (with AJAX) ***********

// HTTP GET request for reading(finding) ALL routes of current database 'routeDB'
router.get("/api/readRoutes", (req, res) => {

  // tell the user about reading routes of current database 'routeDB'
  console.log("Read routes from current database 'routeDB':");

  // (reading)finding all items (all routes) from current database 'routeDB'
  app.locals.db.collection('routeDB').find({}).toArray((error, result) => {

    if (error) {
      // give a notice, that the reading has failed and show the error-message on the console
      console.log("Failure in reading from 'routeDB'.", error.message);

      // in case of an error while reading, do routing to "crudError.html"
      res.redirect('/crudError.html');

      // if no error occurs ...
    } else {
      // ... give a notice, that the reading has succeeded and show the result on the console
      console.log("Successfully read the routes from 'routeDB'.", result);

      // ... send the json-result of the ajax request
      res.json(result);
    }
  });
});




// *********** UPDATE (with html-form) ***********

// HTTP POST request for updating ONE route into current database 'routeDB'
router.post("/api/updateRoute", (req, res) => {

  // tell the user about updating route from current database 'routeDB'
  console.log("Update route from current database 'routeDB':");
  console.dir(req.body);

  // update one item (one route) into current database 'routeDB'
  app.locals.db.collection('routeDB').updateOne( {

    // specify which route has to be updated: update the route with the id "req.body.routeId"
    _id : new mongodb.ObjectID(req.body.routeId)
  },
  { // set the new (to be updated) values of the route:
    $set: {
      routeName : req.body.routeName,
      routeDate : req.body.routeDate,
      routeTime : req.body.routeTime,
      routeDescription : req.body.routeDescription,
      routeGeoJSON : req.body.routeGeoJSON
    }
  },
  (error, result) => {

    //
    if (error) {
      // give a notice, that the updating has failed and show the error-message on the console
      console.log("Failure in updating in 'routeDB'.", error.message);

      // in case of an error while updating, do routing to "crudError.html"
      res.redirect('/crudError.html');

      // if no error occurs ...
    } else {
      // ... give a notice, that the updating has succeeded and show the result on the console
      console.log("Successfully updated route from 'routeDB'.", result);

      // ... routing to "routeManagement.html" at the end of updating
      res.redirect('/routeManagement.html');
    }
  }
);
});




// *********** DELETE ***********

// HTTP POST request for deleting ONE route from current database 'routeDB'
router.post("/api/deleteRoute", (req, res) => {

  // tell the user about deleting route from current database 'routeDB'
  console.log("Delete route from current database 'routeDB':");
  console.dir(req.body);

  // delete one item (one route) from current database 'routeDB'
  app.locals.db.collection('routeDB').deleteOne( {

    // specify which route has to be deleted: delete the route with the id "req.body.routeId"
    _id : new mongodb.ObjectID(req.body.routeId)

  },
  (error, result) => {

    //
    if (error) {
      // give a notice, that the deleting has failed and show the error-message on the console
      console.log("Failure in deleting from 'routeDB'.", error.message);

      // in case of an error while deleting, do routing to "crudError.html"
      res.redirect('/crudError.html');

      // if no error occurs ...
    } else {
      // .... give a notice, that the deleting has succeeded and show the result on the console
      console.log("Successfully deleted route from 'routeDB'.", result);

      // ... routing to "routeManagement.html" at the end of deleting
      res.redirect('/routeManagement.html');
    }
  });
});

*/
module.exports = router;
