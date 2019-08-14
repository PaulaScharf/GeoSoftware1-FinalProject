// jshint esversion: 6
// jshint maxerr: 1000

"use strict";  // JavaScript code is executed in "strict mode"

/**
* @desc final project, Geosoftware1, SoSe2019
* @author name: Katharina Poppinga, matr.: 450 146; name: Paula Scharf, matr.: 450 334
*/



// ********** qUnit client-Tests for testing the availability of the OpenWeatherMap API and the Geonames API **********


QUnit.config.reorder = false;


QUnit.module("API availability tests");


// ************************* availability of the OpenWeatherMap API *************************

QUnit.test("availability OpenWeatherMap API", function (assert) {

  // test-variables (one test case)
  let lat = 40.32346464521419;
  let long = 23.463965480085898;

  // do not finish the test before all async work is completed
  let done = assert.async(1);

  // the URL to test:
  let resource = "https://api.openweathermap.org/data/2.5/weather?lat=" + lat + "&lon=" + long + "&appid=" + token.OPENWEATHERMAP_TOKEN;

  // construct a new XMLhttp-request; with this, do the following:
  let xhrWeather = new XMLHttpRequest();

  // if the value of the readyState-attribute is changed, the following lambda-function is executed
  xhrWeather.onreadystatechange = function() {

    // if the operation is complete (readystate 4: done)
    if (this.readyState === 4) {
      // if status code is NOT 200, the API is NOT correctly available/usable
      assert.equal(this.status, 200, "'readyState' has value 4 and 'status' has value 200.");
      // finish the test considering assert.async(1)
      done();
    }
  };

  // initialize the request
  xhrWeather.open("GET", resource, true);
  // send the request to the server
  xhrWeather.send();
});



// ************************* availability of the Geonames API *************************

QUnit.test("availability Terrain API", function (assert) {

  // test-variables (one test case)
  let lat = 40.32346464521419;
  let long = 23.463965480085898;
  
  // do not finish the test before all async work is completed
  let done = assert.async();

  // the URL to test:
  let resource = "http://api.geonames.org/findNearbyJSON?lat=" + lat + "&lng=" + long + "&username=" + token.usernameTerrainAPI;

  // construct a new XMLhttp-request; with this, do the following:
  let xhrTerrain = new XMLHttpRequest();

  // if the value of the readyState-attribute is changed, the following lambda-function is executed
  xhrTerrain.onreadystatechange = function() {

    // if the operation is complete (readystate 4: done)
    if (this.readyState === 4) {
      // if status code is NOT 200, the API is NOT correctly available/usable
      assert.equal(this.status, 200, "'readyState' has value 4 and 'status' has value 200.");
      // finish the test considering assert.async(1)
      done();
    }
  };

  // initialize the request
  xhrTerrain.open("GET", resource, true);
  // send the request to the server
  xhrTerrain.send();
});
