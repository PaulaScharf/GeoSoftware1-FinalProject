// jshint esversion: 6
// jshint maxerr: 1000

"use strict";  // JavaScript code is executed in "strict mode"

/**
* @desc final project, Geosoftware1, SoSe2019
* @author name: Katharina Poppinga, matr.: 450 146; name: Paula Scharf, matr.: 450 334
*/


// please put in your own tokens:


// KOMMENTARE ÄNDERN, ODER SCHREIBEN, DASS VON MATTHIAS ÜBERNOMMEN


// hack to make "exports" available in the browser as globals
if (typeof exports == "undefined"){
    var exports = window;
}

// tokens
exports.token = {
    // weather data
    OPENWEATHERMAP_TOKEN: "5e48111daa1da0d2673f81e5ec6fe1bc",

    // terrain data
    usernameTerrainAPI: "geosoftw_k_p",
    // PW???

    // animal tracking data
    loginnameAnimalTrackingAPI: "KPoppi",
    passwordAnimalTrackingAPI: "U6_l1#"
};
