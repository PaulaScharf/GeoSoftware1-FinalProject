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


QUnit.test("availability OpenWeatherMap API", function (assert) {


  // note the function call done(); below after all async work completed
  var done = assert.async();

  var readDone = false;

// ...



  assert.ok(/* hier überprüfen*/);

  done();

});



// ************************* availability of the Terrain API *************************


QUnit.test("availability Terrain API", function (assert) {

// ...

});



// ************************* availability of the Animal Tracking API *************************

// EVTL. ALS SERVER TEST MIT MOCHA

QUnit.test("availability Animal Tracking API", function (assert) {

// ...

});
