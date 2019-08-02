// jshint esversion: 6
// jshint maxerr: 1000

"use strict";  // JavaScript code is executed in "strict mode"

/**
* @desc final project, Geosoftware1, SoSe2019
* @author name: Katharina Poppinga, matr.: 450 146; name: Paula Scharf, matr.: 450 334
*/

// please put in your own tokens at 'token.js'



// create the initial map in the "updateMap"-div
var updateMap = L.map('updateMap').setView([0, 0], 2);

// OpenStreetMap tiles as a layer for the map "updateMap"
var oSMLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});

// add the OpenStreetMap tile layer to the map "updateMap"
oSMLayer.addTo(updateMap);



// enable drawing a route into the map "updateMap" (using leaflet.draw) and write the corresponding GeoJSON string into textarea "updateRoute"
drawPolyline(updateMap, "updateRoute");






// SINGLE ROUTE IN UPDATEMAP LADEN!!!


/*
// extract the coordinates of the i-th route
coordinatesRoute = response[i].geoJson.features[0].geometry.coordinates;

// for the first route of the database ...
if (i === 0) {
  // ... center the map on the first point of the first route
  allRoutesMap.setView([coordinatesRoute[i][1], coordinatesRoute[i][0]], 2);
}

// outsource the swapping of the order of the coordinates (GeoJSONs long-lat order to needed lat-long order)
var coordinatesLatLongOrder = swapGeoJSONsLongLatToLatLongOrder(coordinatesRoute);

// make a leaflet-polyline from the coordinatesLatLongOrder
let polylineOfRoute = L.polyline(coordinatesLatLongOrder, {color: '#ec0000'}, {weight: '3'});

// add the polyline to the array polylineRoutesLatLongArray for being able to address the polylines(routes) by numbers (kind of IDs) (needed for checkboxes)
polylineRoutesLatLongArray.push(polylineOfRoute);

// add the i-th polyline-element of the array polylineRoutesLatLongArray to the routesGroup and therefore to the map "allRoutesMap"
polylineRoutesLatLongArray[i].addTo(routesGroup);
*/










// HIER JS AUS EJS EINFÜGEN
