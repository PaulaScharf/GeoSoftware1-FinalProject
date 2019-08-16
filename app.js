// jshint esversion: 8
// jshint maxerr: 1000

"use strict";  // JavaScript code is executed in "strict mode"


/**
* @desc final project, Geosoftware1, SoSe2019
* @author name: Katharina Poppinga, matr.: 450 146; name: Paula Scharf, matr.: 450 334
*/

// using standard port 3000
var port = 3000;


// ********** load modules: **********
// load http-module and save it in const-OBJECT http
const http = require("http");
// load http-module and save it in const-OBJECT http
const https = require("https");
// load path-module and save it in const-OBJECT path
const path = require("path");


// ********** load third-modules: (after installed using cmd: npm install ...) **********
const express = require('express');
var bodyParser = require('body-parser');
// call express and save it in the function app
const app = express();

const mongodb = require('mongodb');
var createError = require('http-errors');

var JL = require('jsnlog').JL;
var jsnlog_nodejs = require('jsnlog-nodejs').jsnlog_nodejs;
// ********************

// set the routers-paths
var indexRouter = require('./routes/index');
var routesRouter = require('./routes/routes');
var encountersRouter = require('./routes/encounters');


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


// load/provide all files given in the folder public
app.use(express.static(path.join(__dirname, 'public')));

// use built-in middleware which parses incoming requests with JSON payloads so that explicit parse expressions for every JSON are not necessary
app.use(express.json());

// use built-in middleware which parses urlencoded bodies, https://expressjs.com/en/4x/api.html#express.urlencoded
app.use(express.urlencoded({ extended: false }));


// set the routes for npm-installed client-libraries
app.use("/jquery", express.static(path.join(__dirname, 'node_modules', 'jquery', 'dist')));
app.use("/bootstrap", express.static(path.join(__dirname, 'node_modules', 'bootstrap', 'dist')));
app.use("/popper", express.static(path.join(__dirname, 'node_modules', 'popper.js', 'dist')));
app.use("/leaflet", express.static(path.join(__dirname, 'node_modules', 'leaflet', 'dist')));
app.use("/leaflet-draw", express.static(path.join(__dirname, 'node_modules', 'leaflet-draw', 'dist')));
app.use("/turf", express.static(path.join(__dirname, 'node_modules', '@Turf', 'turf')));
app.use('/jsnlog', express.static(path.join(__dirname, 'node_modules', 'jsnlog')));
app.use('/qunit', express.static(path.join(__dirname, 'node_modules', 'qunit', 'qunit')));



// ************************** mondo-database connection ***************************
/**
*
* Try to connect to mongodb on localhost:27017 (if not using docker),
* if not possible try to connect on mongodbservice:27017 (if using docker),
* if not possible throw an exception/error.
*
*/
function connectMongoDb() {

  // connect to MongoDB and use database "routeDB":
  // asynchronous scope
  (async () => {

    // try to connect to mongodb on localhost:27017
    try {
      // await blocks and waits for connection, because here synchronous execution is desired
      app.locals.dbConnection = await mongodb.MongoClient.connect(
        // connectionString / connection URL:
        "mongodb://localhost:27017",
        {
          useNewUrlParser: true,
          autoReconnect: true
        }
      );

      // connect to and use database "routeDB" (create this database, if it does not exist)
      app.locals.db = await app.locals.dbConnection.db("routeDB");
      // tell the user that the connection is established and databse "routeDB" will be used for following operations
      console.log("Using DB: " + app.locals.db.databaseName);

      // tell the user the URL for starting the application / where the routes are shown
      console.log("URL for starting the app: http://localhost:" + port + "/");

      // catch possible errors and tell the user about them:
    } catch (error) {

      // for using docker:
      // try to connect to mongodb on mongodbservice:27017
      try {
        // await blocks and waits for connection, because here synchronous execution is desired
        app.locals.dbConnection = await mongodb.MongoClient.connect(
          // connectionString / connection URL: docker container "mongodbservice"
          "mongodb://mongodbservice:27017",
          {
            useNewUrlParser: true,
            autoReconnect: true
          }
        );

        // connect to and use database "routeDB" (create this database, if it does not exist)
        app.locals.db = await app.locals.dbConnection.db("routeDB");
        // tell the user that the connection is established and databse "routeDB" will be used for following operations
        console.log("Using DB: " + app.locals.db.databaseName);

        // tell the user the URL for starting the application / where the routes are shown
        console.log("URL for starting the app: http://localhost:" + port + "/");


        // if it is not possible to connect on localhost:27017 or mongodbservice:27017,
        // catch possible errors and tell the user about them:
      } catch (error) {

        // TODO: ? APP NICHT STARTEN

        console.log(error.message);
        console.dir(error);

        // retry until db-server is up
        setTimeout(connectMongoDb, 3000);
      }
    }
  }
)();
}

// connect to MongoDB
connectMongoDb();


// taken from template of Assignment 8:
// middleware for making the db connection available via the request object
app.use((req, res, next) => {
  req.db = app.locals.db;
  next();
});


// ********************************** JSNLog ***********************************

// "ensure that the JSON objects received from the client get parsed correctly"
app.use(bodyParser.json());

// jsnlog.js on the client-side sends log messages to /jsnlog.logger, using POST
app.post("/jsnlog.logger", function (req, res) {
  jsnlog_nodejs(JL, req.body);

  // jsnlog on the client-side does not use the response from server, therefore send an empty response
  res.send('');
});


// **************************** Animal tracking API ****************************

// http-POST to forward user input for studyID when requesting the animal tracking API
app.post("/animalTrackingAPI/individualIds", (req, res) => {

  // request-resource for the following https-GET request for individualIDs of the animal tracking API
  var resource = "https://www.movebank.org/movebank/service/json-auth?entity_type=individual&study_id=" + req.body.studyID;

  // loginname and password needed for authorization during the get-request
  var loginname = require(path.join(__dirname, 'public', 'javascript', 'tokens.js')).token.loginnameAnimalTrackingAPI;
  var password = require(path.join(__dirname, 'public', 'javascript', 'tokens.js')).token.passwordAnimalTrackingAPI;

  // define options for the following https-GET request
  const options = {
    // set the headers for the get-request
    headers: {
      "Authorization":"Basic " + Buffer.from(loginname+':'+password).toString('base64'),
      "access-control-allow-origin": "localhost:3000",
      "access-control-allow-methods": "GET, POST",
      "access-control-allow-headers": "content-type"
    },
    // timeout set to 5 seconds
    timeout: 5000
  };

  // GET animal tracking api:
  https.get(resource, options, (httpResponse) => {

    var body = "";

    httpResponse.on('data', (chunk) => {
      body += chunk;
    });

    httpResponse.on("end", () => {

      try {
        body = JSON.parse(body);
        res.send(body);

        // if an error occurs in parsing and sending the body ...
      } catch(e) {
        // ... send a message
        res.send({
          errorMessage: "There was an error."
        })
      }
    });

    // if an error occurs while getting the animal tracking api ...
  }).on('error', (error) => {
    // ... give a notice, that the API request has failed and show the error on the console
    console.log("Failure while getting animal tracking data from movebank API.", error);
  });
});



// http-POST to forward user inputs for studyID, individualID and maxEventsPerIndividual when requesting the animal tracking API
app.post("/animalTrackingAPI", (req, res) => {

  // request-resource for the following https-GET request
  let resource = "https://www.movebank.org/movebank/service/json-auth?study_id=" + req.body.studyID + "&individual_local_identifiers[]=" + req.body.individualID + "&max_events_per_individual=" + req.body.maxEventsPerIndividual + "&sensor_type=gps";

  // loginname and password needed for authorization during the get-request
  let loginname = require(path.join(__dirname, 'public', 'javascript', 'tokens.js')).token.loginnameAnimalTrackingAPI;
  let password = require(path.join(__dirname, 'public', 'javascript', 'tokens.js')).token.passwordAnimalTrackingAPI;

  // define options for the following https-GET request
  const options = {
    // set the headers for the get-request
    headers: {
      "Authorization":"Basic " + Buffer.from(loginname+':'+password).toString('base64'),
      "access-control-allow-origin": "localhost:3000",
      "access-control-allow-methods": "GET, POST",
      "access-control-allow-headers": "content-type"
    },
    // timeout set to 5 seconds
    timeout: 5000
  };

  // GET animal tracking api:
  https.get(resource, options, (httpResponse) => {

    let body = "";

    httpResponse.on('data', (chunk) => {
      body += chunk;
    });

    httpResponse.on("end", () => {

      try {
        body = JSON.parse(body);
        res.send(body);

        // if an error occurs in parsing and sending the body ...
      } catch(e) {
        // ... send a message
        res.send({
          errorMessage: "There was an error."
        })
      }
    });

    // if an error occurs while getting the animal tracking api ...
  }).on('error', (error) => {
    // ... give a notice, that the API request has failed and show the error on the console
    console.log("Failure while getting animal tracking data from movebank API.", error);
  });
});


// *****************************************************************************


// index-router
app.use('/', indexRouter);

// CRUD functionality for routes
app.use('/routes', routesRouter);

// CRUD functionality for encounters
app.use('/encounter', encountersRouter);


// route for the client-side tests using qUnit
app.get("/test", (req, res) => {
  res.render("test");
});


// taken from template of Assignment 8:
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});


// taken from template of Assignment 8:
// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


module.exports = app;
