// jshint esversion: 8
// jshint maxerr: 1000

"use strict";  // JavaScript code is executed in "strict mode"


/**
* @desc final project, Geosoftware1, SoSe2019
* @author name: Katharina Poppinga, matr.: 450 146; name: Paula Scharf, matr.: 450 334
*/


// load modules:
// load http-module and save it in const-OBJECT http
const http = require("http");
// load http-module and save it in const-OBJECT http
const https = require("https");
// load path-module and save it in const-OBJECT path
const path = require("path");


// load third-modules: (after installed using cmd: npm install ...)
const express = require('express');
var bodyParser = require('body-parser');
// call express and save it in the function app
const app = express();

// ÜBERHAUPT NÖTIG?????? (für jsnlog installiert, um require client-seitig nutzen zu können)
const browserify = require('browserify');

const mongodb = require('mongodb');
// WERDEN BEIDEN FOLGENDEN ÜBERHAUPT GENUTZT????
var createError = require('http-errors');
var cookieParser = require('cookie-parser');


// JSNLog
var JL = require('jsnlog').JL;
var jsnlog_nodejs = require('jsnlog-nodejs').jsnlog_nodejs;


// ******************** folgendes an andere Stelle dieser Datei??? ********************

// KOMMENTARE ÄNDERN, DA VON DOC WEBSITE
// ensure that the JSON objects received from the client get parsed correctly.
app.use(bodyParser.json())

// jsnlog.js on the client-side by default sends log messages to /jsnlog.logger, using POST.
app.post("/jsnlog.logger", function (req, res) {
  //app.post('*.logger', function (req, res) {
  jsnlog_nodejs(JL, req.body);

  // Send empty response. This is ok, because client side jsnlog does not use response from server.
  res.send('');
});










// *******************************************************************************

// TODO: PATH.JOIN VERWENDEN, ANSTATT DIRNAME UND /
var indexRouter = require('./routes/index');
var itemsRouter = require('./routes/items');
var encountersRouter = require('./routes/encounters');


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


// load/provide all files given in the folder public
app.use(express.static(path.join(__dirname, 'public')));

// use built-in middleware which parses incoming requests with JSON payloads so that explicit parse expressions for every JSON are not necessary
app.use(express.json());

// use built-in middleware which parses urlencoded bodies
// https://expressjs.com/en/4x/api.html#express.urlencoded
app.use(express.urlencoded({ extended: false }));

// WOZU ?????
app.use(cookieParser());



// routes for npm-installed client-libraries
app.use("/leaflet", express.static(path.join(__dirname, 'node_modules', 'leaflet', 'dist')));
app.use("/leaflet-draw", express.static(path.join(__dirname, 'node_modules', 'leaflet-draw', 'dist')));
app.use("/jquery", express.static(path.join(__dirname, 'node_modules', 'jquery', 'dist')));
app.use("/bootstrap", express.static(path.join(__dirname, 'node_modules', 'bootstrap', 'dist')));
app.use("/popper", express.static(path.join(__dirname, 'node_modules', 'popper.js', 'dist')));
app.use("/turf", express.static(path.join(__dirname, 'node_modules', '@Turf', 'turf')));



// TODO: DATENBANKVERBINDUNG SOLL AUTOMATISCH FÜR MIT UND (!!!) OHNE DOCKER FUNKTIONIEREN
// connect to MongoDB and use database "routeDB":
// asynchronous scope
(async () => {
  // try to connect to mongodb on localhost:27017, if not possible throw an exception/error:
  try {
    // await blocks and waits for connection, because here synchronous execution is desired
    app.locals.dbConnection = await mongodb.MongoClient.connect(
      // connectionString / connection URL:
      "mongodb://localhost:27017",
      {
        useNewUrlParser: true,
        autoReconnect: true
      });

      // connect to and use database "routeDB" (create this database, if it does not exist)
      app.locals.db = await app.locals.dbConnection.db("routeDB");
      // tell the user that the connection is established and databse "routeDB" will be used for following operations
      console.log("Using DB: " + app.locals.db.databaseName);

      // tell the user the URL for starting the application / where the routes are shown
      console.log("URL for starting and viewing the routes: http://localhost:" + port + "/");

      // catch possible errors and tell the user about them:
    } catch (error) {
      console.dir(error);
      console.log(error.message);
    }
  }) ();


  // using standard port 3000
  var port = 3000;



  // *********************** regarding animal tracking API ***********************

  app.get("/createAnimalRoute", (req, res) => {
    res.render("createAnimalRoute");
  });


  // FÜR ANIMAL TRACKING API??
  // middleware for ... CORS: origin-response
  app.use((req, res, next) => {
    res.set("access-control-allow-origin", "localhost:3000");
    next();
  });


  // FÜR ANIMAL TRACKING API??
  // middleware for options header... CORS: origin-response
  app.options("localhost:3000", (res, next) => {
    res.set({
      "access-control-allow-methods": "GET, POST",
      "access-control-allow-headers": "content-type"
    });
    res.status(204).end();
  });


  //
  app.get("/animalTrackingAPI",  (req, res) => {

    // catch error, WO???


    // TODO: max_events_per_individual festlegen

    //
    var resource = "https://www.movebank.org/movebank/service/json-auth?study_id=" + req.query.studyID + "&individual_local_identifiers[]=" + req.query.individualID + "&max_events_per_individual=200&sensor_type=gps";

    // console.log(resource);
    // https://www.datarepository.movebank.org/handle/10255/move.610
    //
    var loginname = require(path.join(__dirname, 'public', 'javascript', 'tokens.js')).token.loginnameAnimalTrackingAPI;
    var password = require(path.join(__dirname, 'public', 'javascript', 'tokens.js')).token.passwordAnimalTrackingAPI;

    //
    const options = {

      //  method: 'GET',
      headers: {
        'Authorization':'Basic ' + Buffer.from(loginname+':'+password).toString('base64')
        //    "access-control-allow-origin": "localhost:3000",
        //    "access-control-allow-methods": "GET, POST",
        //    "access-control-allow-headers": "content-type"
      }
    };


    // GET animal tracking api:
    https.get(resource, options, (httpResponse) => {

      var body = "";

      httpResponse.on('data', (chunk) => {
        body += chunk;
      });

      httpResponse.on("end", () => {
        //  res.json(JSON.parse(body));

        try {
          //
          body = JSON.parse(body);

          //
          res.send(body);
        } catch(e) {
          res.send({
            errorMessage: "there was an error"
          })
        }

      });



    }).on('error', (error) => {
      // give a notice, that the API request has failed and show the error-message on the console
      console.log("Failure while getting animal tracking data from movebank API.", error.message);

      //httpResponse.on("error", (error) => {
      //console.error(error);
    });


  });

app.get("/animalTrackingAPI/individualIds",  (req, res) => {

  // catch error, WO???


  // TODO: max_events_per_individual festlegen

  //
  var resource = "https://www.movebank.org/movebank/service/json-auth?entity_type=individual&study_id=" + req.query.studyID;

  // console.log(resource);
  // https://www.datarepository.movebank.org/handle/10255/move.610
  //
  var loginname = require(path.join(__dirname, 'public', 'javascript', 'tokens.js')).token.loginnameAnimalTrackingAPI;
  var password = require(path.join(__dirname, 'public', 'javascript', 'tokens.js')).token.passwordAnimalTrackingAPI;

  //
  const options = {

    //  method: 'GET',
    headers: {
      'Authorization':'Basic ' + Buffer.from(loginname+':'+password).toString('base64')
      //    "access-control-allow-origin": "localhost:3000",
      //    "access-control-allow-methods": "GET, POST",
      //    "access-control-allow-headers": "content-type"
    }
  };


  // GET animal tracking api:
  https.get(resource, options, (httpResponse) => {

    var body = "";

    httpResponse.on('data', (chunk) => {
      body += chunk;
    });

    httpResponse.on("end", () => {
      //  res.json(JSON.parse(body));
      try {
        //
        body = JSON.parse(body);

        //
        res.send(body);
      } catch(e) {
        res.send({
          errorMessage: "there was an error"
        })
      }

    });



  }).on('error', (error) => {
    // give a notice, that the API request has failed and show the error-message on the console
    console.log("Failure while getting animal tracking data from movebank API.", error.message);

    //httpResponse.on("error", (error) => {
    //console.error(error);
  });


});

  // *****************************************************************************



  // taken from template of Assignment 8:
  // middleware for making the db connection available via the request object
  app.use((req, res, next) => {
    req.db = app.locals.db;
    next();
  });



  //
  app.use('/', indexRouter);

  // CRUD functionality for routes
  app.use('/item', itemsRouter);

  //
  app.use('/encounter', encountersRouter);



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
