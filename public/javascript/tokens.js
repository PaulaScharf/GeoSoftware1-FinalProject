// jshint esversion: 6
// jshint maxerr: 1000

"use strict";  // JavaScript code is executed in "strict mode"

/**
* @desc final project, Geosoftware1, SoSe2019
* @author name: Katharina Poppinga, matr.: 450 146; name: Paula Scharf, matr.: 450 334
*/


// please put in your own tokens here:

// following format of the code taken from https://github.com/streuselcake/jslab/blob/master/_api-token/sample_token.js


// hack to make "exports" available in the browser as globals
if (typeof exports == "undefined"){
    var exports = window;
}

// all needed tokens:
exports.token = {
    // token for OpenWeatherMap API: weather data
    OPENWEATHERMAP_TOKEN: "XXX",

    // token for Geonames API: country & terrain data
    usernameTerrainAPI: "XXX",

    // tokens for Movebank API: animal tracking data
    loginnameAnimalTrackingAPI: "XXX",
    passwordAnimalTrackingAPI: "XXX"
};
