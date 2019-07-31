// jshint esversion: 6
// jshint maxerr: 1000

"use strict";  // JavaScript code is executed in "strict mode"

/**
* @desc final project, Geosoftware1, SoSe2019
* @author name: Katharina Poppinga, matr.: 450 146; name: Paula Scharf, matr.: 450 334
*/

// please put in your own tokens at 'token.js'


// create the initial map for routing in the "updateMap"-HTMLdiv
var routeUpdateMap = L.map('updateMap').setView([0, 0], 12);

// OpenStreetMap tiles as a layer for the map
var oSMLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});

// add the OpenStreetMap tile layer to the routeUpdateMap
oSMLayer.addTo(routeUpdateMap);





// ROUTE IN MAP LADEN und:
// leaflet.draw aus anderer Datei übernehmen, bzw, in andere Datei auslagern, Modularisierung!
