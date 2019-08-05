// jshint esversion: 6
// jshint maxerr: 1000

"use strict";  // JavaScript code is executed in "strict mode"

/**
* @desc final project, Geosoftware1, SoSe2019
* @author name: Katharina Poppinga, matr.: 450 146; name: Paula Scharf, matr.: 450 334
*/

// please put in your own tokens at 'token.js'



// FOLGENDES IN ONLOAD-FUNKTION SCHREIBEN???


// create the initial map in the "createMap"-div
var createMap = L.map('createMap').setView([0, 0], 2);

// OpenStreetMap tiles as a layer for the map "createMap"
var oSMLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});

// add the OpenStreetMap tile layer to the map "createMap"
oSMLayer.addTo(createMap);


// enable drawing a route into the map "createMap" (using leaflet.draw) and write the corresponding GeoJSON string into textarea "createRoute"
drawPolyline(createMap, "createRoute");



// HIER JS AUS EJS EINFÜGEN
