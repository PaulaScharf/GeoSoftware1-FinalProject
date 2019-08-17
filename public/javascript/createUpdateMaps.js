// jshint esversion: 6
// jshint maxerr: 1000

"use strict";  // JavaScript code is executed in "strict mode"

/**
* @desc final project, Geosoftware1, SoSe2019
* @author name: Katharina Poppinga, matr.: 450 146; name: Paula Scharf, matr.: 450 334
*/


/**
* Sets up a leaflet-map with OpenStreetMap tiles and calls a function for enabling the drawing of a polyline into that map.
* If the given map is the "createMap", also calls another function "getAllRoutes()".
* If the given map is the "updateMap", shows the route written in the textarea with ID "updateRoute" in the map.
*
* @private
* @author Katharina Poppinga, matr.: 450146
* @param specificMap ID of a leaflet-map (createMap oder updateMap)
*/
function showMapData(specificMap) {

  // to have two onload-functions in create.ejs bundled, also call getAllRoutes() when the onload calls the showMapData(createMap)
  if (specificMap === "createMap") {
    getAllRoutes();
  }

  // create the initial map in the map-div
  let map = L.map(specificMap).setView([0, 0], 2);

  // OpenStreetMap tiles as a layer for the map
  let oSMLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  });
  // add the OpenStreetMap tile layer to the map
  oSMLayer.addTo(map);

  // if the given map is the "createMap" ...
  if (specificMap === "createMap") {
    // ... enable drawing a route into the map "createMap" (using leaflet.draw) and write the corresponding GeoJSON string into textarea "createRoute"
    drawPolyline(map, "createRoute", "none", "none");
  }


  // if the given map is the "updateMap" ...
  if (specificMap === "updateMap") {

    // ****************** display the old route (the route that shall be updated) in the map "updateMap" ******************

    // get the old route as a GeoJSON-object
    let oldRouteGeoJSON = JSON.parse(document.getElementById("updateRoute").innerHTML);

    // extract the coordinates of the old route
    let coordinatesOldRoute = oldRouteGeoJSON.features[0].geometry.coordinates;

    // outsource the swapping of the order of the coordinates of the old route (GeoJSONs long-lat order to needed lat-long order)
    let coordinatesOldLatLongOrder = swapGeoJSONsLongLatToLatLongOrder_Objects(coordinatesOldRoute);

    // make a leaflet-polyline from the coordinatesOldLatLongOrder
    let polylineOfOldRoute = L.polyline(coordinatesOldLatLongOrder, {color: '#ec0000'}, {weight: '3'});

    // add the polyline-element of the old route to the map "updateMap"
    polylineOfOldRoute.addTo(map);

    // ... set the proper map extract for the old route
    map.fitBounds(polylineOfOldRoute.getBounds());

    // *********************************************************************************************************************

    // enable drawing a route into the map "updateMap" (using leaflet.draw) and write the corresponding GeoJSON string into textarea "updateRoute"
    drawPolyline(map, "updateRoute", polylineOfOldRoute, oldRouteGeoJSON);
  }
}
