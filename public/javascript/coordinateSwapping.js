// jshint esversion: 6
// jshint maxerr: 1000

"use strict";  // JavaScript code is executed in "strict mode"

/**
* @desc final project, Geosoftware1, SoSe2019
* @author name: Katharina Poppinga, matr.: 450 146; name: Paula Scharf, matr.: 450 334
*/


/**
* Takes the coordinates of a route as valid GeoJSON (just the geometry.coordinates-part) and swaps these coordinate-pairs.
* This means this function takes one array (with all coordinates) containing arrays (individual long-lat-pairs) of a route.
* and returns one array containing arrays with the routes' coordinates as lat-long-pairs.
*
* @author Katharina Poppinga, matr.: 450146
* @param {array} longLatCoordinatesRoute - coordinates of a route as valid GeoJSON (just the geometry.coordinates-part, array containing arrays)
* @return {array} latLongCoordinatesRoute: one array containing arrays with the coordinates of the route as lat-long-pairs
*/
function swapGeoJSONsLongLatToLatLongOrder_Arrays(longLatCoordinatesRoute){

  // point with lat,long-order of its coordinate
  let latLong;

  // array for (later in this function) containing the route-coordinates as arrays with its points in lat,long-coordinate-order
  let latLongCoordinatesRoute = [];

  let c;
  // loop "over" all points in given route
  for (c = 0; c < longLatCoordinatesRoute.length; c++){

    // swap current long,lat coordinate (array) to lat,long coordinate (object)
    latLong = L.GeoJSON.coordsToLatLng(longLatCoordinatesRoute[c]);

    // write new built lat,long-coordinate-pair (as an array) into the array latLongCoordinatesRoute, for getting the given route with swapped coordinates
    latLongCoordinatesRoute.push([latLong.lat, latLong.lng]);
  }

  // return the given route with swapped coordinates as one array containing arrays
  return latLongCoordinatesRoute;
}


/**
* Takes the coordinates of a route as valid GeoJSON (just the geometry.coordinates-part) and swaps these coordinate-pairs.
* This means this function takes one array (with all coordinates) containing arrays (individual long-lat-pairs) of a route.
* and returns one array containing objects (not arrays!) with the routes' coordinates as lat-long-pairs.
*
* @author Katharina Poppinga, matr.: 450146
* @param {array} longLatCoordinatesRoute - coordinates of a route as valid GeoJSON (just the geometry.coordinates-part, array containing arrays)
* @return {array} latLongCoordinatesRoute: one array containing objects (not arrays!) with the coordinates of the route as lat-long-pairs
*/
function swapGeoJSONsLongLatToLatLongOrder_Objects(longLatCoordinatesRoute){

    // point with lat,long-order of its coordinate
    let latLong;

    // array for (later in this function) containing the route-coordinates with its points as objects in lat,long-coordinate-order
    let latLongCoordinatesRoute = [];

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
