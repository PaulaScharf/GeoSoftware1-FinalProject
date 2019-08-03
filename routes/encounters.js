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

// *********** CREATE/insert (with html-form) ***********
// add a route from the req.body and redirect to the create.html
var postitemcontroller = function(req, res) {
    console.log("insert encounter");
    console.log(req.body);
    // your only able to add an item if it contains atleast the route-coordinates and a name

    // insert one item (one route) into current database
    req.db.collection('routeDB').insertOne(req.body, (error, result) => {
        if (error) {
            console.dir(error);
        }
        // after the item (route) is successfully created go back to the create-page
        res.send(result)
    });
};

router.route("/post")
    .post(postitemcontroller);

module.exports = router;
