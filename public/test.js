// jshint esversion: 6
// jshint maxerr: 1000

"use strict";  // JavaScript code is executed in "strict mode"

/**
* @desc final project, Geosoftware1, SoSe2019
* @author name: Katharina Poppinga, matr.: 450 146; name: Paula Scharf, matr.: 450 334
*/



// WIE BZW. VON WO BZW. WANN DIESE TESTS AUFRUFEN ??????????



// ********** qUnit client-Tests for testing the availability of all three APIs used in this project **********


QUnit.config.reorder = false;


// EVTL. NICHT BENÖTIGT
var itemId;


QUnit.module("API availability tests");


// ************************* availability of the OpenWeatherMap API *************************


// TODO: NOCH WEITERE STATUS CODES ABFANGEN ????? ODER WELCHE ÜBERHAUPT?

QUnit.test("availability OpenWeatherMap API", function (assert) {


  // note the function call done(); below after all async work completed
  let done = assert.async();

  // WO VERWENDEN???
  let readDone = false;


  //
  let resource = "https://api.openweathermap.org/data/2.5/weather?lat=" + lat + "&lon=" + long + "&appid=" + token.OPENWEATHERMAP_TOKEN;

  //
  let xhrWeather = new XMLHttpRequest();


  // print facts and data about the loading of the request and the status of the request in the console
  xhrWeather.onload = function() {
    //console.dir(xhrWeather);
    //console.log(xhrWeather.status);
  };


  // capture errors and ........
  xhrWeather.onerror = function(e) {
    //
    assert.ok(false, "OpenWeatherMap not available, error: " + e);
    //
    done();
  };


  // if the value of the readyState-attribute is changed, the following lambda-function is executed
  xhrWeather.onreadystatechange = function() {
    // if the operation is complete (readystate 4: done) and the request is succeeded
    if (this.readyState === 4 && this.status === 200) {


      // WAS HIER ÜBERPRÜFEN???? ODER ÜBERHAUPT ETWAS??
      // parse the description of the weather, that is given in the response, into object and write this description into corresponding HTMLtable-cell
      var weatherText = JSON.parse(this.responseText).weather[0].description;

      //
      assert.ok(/* hier überprüfen*/);
      //
      done();

    }
  };

  // initialize the request
  xhrWeather.open("GET", resource, true);
  // send the request to the server
  xhrWeather.send();

});



// ************************* availability of the Terrain API *************************


QUnit.test("availability Terrain API", function (assert) {

  // ...

  // http://api.geonames.org/findNearbyJSON?lat=" + lat + "&lng=" + long + "&username=" + token.usernameTerrainAPI;



});



// ************************* availability of the Animal Tracking API *************************

// EVTL. ALS SERVER TEST MIT MOCHA

QUnit.test("availability Animal Tracking API", function (assert) {

  // ...

  // https://www.movebank.org/movebank/service/public/json?study_id=" + req.query.studyID + "&individual_local_identifiers[]=" + req.query.individualID + "&max_events_per_individual=200&sensor_type=gps"



});
