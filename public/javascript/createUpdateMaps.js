/// jshint esversion: 6
// jshint maxerr: 1000

"use strict";  // JavaScript code is executed in "strict mode"

/**
* @desc final project, Geosoftware1, SoSe2019
* @author name: Katharina Poppinga, matr.: 450 146; name: Paula Scharf, matr.: 450 334
*/


/**
*
*
*
* @author Katharina Poppinga 450146
* @param specificMap (createMap oder updateMap)
*/
function showMapData(specificMap) {

  //
  // um onload zu bündeln
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

//
  if (specificMap === "createMap") {
  // enable drawing a route into the map "createMap" (using leaflet.draw) and write the corresponding GeoJSON string into textarea "createRoute"
  drawPolyline(map, "createRoute", "none", "none");
}


  //
  if (specificMap === "updateMap") {

    // ****************** display the old route (the route that shall be updated) in the map "updateMap" ******************

    //
    let oldRouteGeoJSON = JSON.parse(document.getElementById("updateRoute").innerHTML);

    console.log("old: ", oldRouteGeoJSON);

    // extract the coordinates of the route that shall be updated (old route)
    let coordinatesOldRoute = oldRouteGeoJSON.features[0].geometry.coordinates;


    // outsource the swapping of the order of the coordinates (GeoJSONs long-lat order to needed lat-long order)
    let coordinatesOldLatLongOrder = swapGeoJSONsLongLatToLatLongOrder_Objects(coordinatesOldRoute);

    // make a leaflet-polyline from the coordinatesOldLatLongOrder
    let polylineOfOldRoute = L.polyline(coordinatesOldLatLongOrder, {color: '#ec0000'}, {weight: '3'});

    // add the polyline-element of the old route to the map "updateMap"
    polylineOfOldRoute.addTo(map);

    // ... center the map on the old route
    map.fitBounds(polylineOfOldRoute.getBounds());

    // *********************************************************************************************************************

    // enable drawing a route into the map "updateMap" (using leaflet.draw) and write the corresponding GeoJSON string into textarea "updateRoute"
    drawPolyline(map, "updateRoute", polylineOfOldRoute, oldRouteGeoJSON);
  }
}
