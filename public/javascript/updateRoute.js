// jshint esversion: 6
// jshint maxerr: 1000

"use strict";  // JavaScript code is executed in "strict mode"

/**
* @desc final project, Geosoftware1, SoSe2019
* @author name: Katharina Poppinga, matr.: 450 146; name: Paula Scharf, matr.: 450 334
*/

// please put in your own tokens at 'token.js'



// FOLGENDES IN ONLOAD-FUNKTION SCHREIBEN???

// create the initial map in the "updateMap"-div
let updateMap = L.map('updateMap').setView([0, 0], 2);

// OpenStreetMap tiles as a layer for the map "updateMap"
let oSMLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});

// add the OpenStreetMap tile layer to the map "updateMap"
oSMLayer.addTo(updateMap);


// enable drawing a route into the map "updateMap" (using leaflet.draw) and write the corresponding GeoJSON string into textarea "updateRoute"
drawPolyline(updateMap, "updateRoute");




// ****************** display the old route (the route that shall be updated) in the map "updateMap" ******************

//
let oldRouteGeoJSON = JSON.parse(document.getElementById("updateRoute").innerHTML);

// extract the coordinates of the route that shall be updated (old route)
let coordinatesOldRoute = oldRouteGeoJSON.features[0].geometry.coordinates;

// ... center the map on the first point of the old route
updateMap.setView([coordinatesOldRoute[0][1], coordinatesOldRoute[0][0]], 2);

// outsource the swapping of the order of the coordinates (GeoJSONs long-lat order to needed lat-long order)
let coordinatesOldLatLongOrder = swapGeoJSONsLongLatToLatLongOrder(coordinatesOldRoute);

// make a leaflet-polyline from the coordinatesOldLatLongOrder
let polylineOfOldRoute = L.polyline(coordinatesOldLatLongOrder, {color: '#ec0000'}, {weight: '3'});

// add the polyline-element of the old route to the map "updateMap"
polylineOfOldRoute.addTo(updateMap);

// *********************************************************************************************************************



// FUNKTION HIER DOPPELT, STEHT BEREITS IN READROUTESENCOUNTERS.JS, DIESE DATEI SOLL ABER NICHT IN SINGLEROUTE.EJS
// EINGEBUNDEN WERDEN. DIESES PROBLEM LÖSEN, DATEIEN NEU AUFTEILEN

function swapGeoJSONsLongLatToLatLongOrder(longLatCoordinatesRoute){

    // point with lat,long-order of its coordinate
    let latLong;

    // array for (later in this function) containing the route-coordinates with its points as objects in lat,long-coordinate-order
    var latLongCoordinatesRoute = [];

    let c;
    // loop "over" all points in given route
    for (c = 0; c < longLatCoordinatesRoute.length; c++){

        // swap current long,lat coordinate (array) to lat,long coordinate (object)
        latLong = L.GeoJSON.coordsToLatLng(longLatCoordinatesRoute[c]);

        // write new built lat,long-coordinate-pair (as an object) into the array latLongCoordinatesRoute, for getting the given route with swapped coordinates
        latLongCoordinatesRoute.push(latLong);
    }

    // return the given route with swapped coordinates as one array containing objects (not arrays!)
    return latLongCoordinatesRoute;
}





// HIER JS AUS EJS EINFÜGEN
