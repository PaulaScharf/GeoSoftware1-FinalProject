// jshint esversion: 6
// jshint maxerr: 1000

"use strict";  // JavaScript code is executed in "strict mode"

/**
 * @desc final project, Geosoftware1, SoSe2019
 * @author name: Katharina Poppinga, matr.: 450 146; name: Paula Scharf, matr.: 450 334
 */

// please put in your own tokens at 'token.js'


//
var alreadyKnownRoutes = [];


function getAllRoutes() {
  $.ajax({
    // use a http GET request
    type: "GET",
    // URL to send the request to
    url: "/displayAll",
    // data type of the response
    dataType: "json"
  })

  // if the request is done successfully, ...
      .done(function (response) {

        console.log("ajax-GET-response:", response);

        // ... ?
        checkForNewRoute(response);


        // ... give a notice on the console that the AJAX request for reading all routes has succeeded
        console.log("AJAX request (reading all routes) is done successfully.");
      })

      // if the request has failed, ...
      .fail(function (xhr, status, error) {
        // ... give a notice that the AJAX request for reading all routes has failed and show the error-message on the console
        console.log("AJAX request (reading all routes) has failed.", error.message);
      });
}

function getAllEncounters() {
  $.ajax({
    // use a http GET request
    type: "GET",
    // URL to send the request to
    url: "/encounter/getAll",
    // data type of the response
    dataType: "json"
  })

  // if the request is done successfully, ...
      .done (function (response) {

        for (let i = 0; i < response.length; i++) {
          let currentEncounter = response[i];
          let noOfRoutes = {firstRoute: undefined, secondRoute: undefined};
          for (let k = 0; k < allRoutes.length; k++) {
            if(allRoutes[k][0]._id == currentEncounter.firstRoute) {
              noOfRoutes.firstRoute = k;
            }
            else if(allRoutes[k][0]._id == currentEncounter.secondRoute) {
              noOfRoutes.secondRoute = k;
            }
          }
          if(typeof noOfRoutes.firstRoute === "undefined" || typeof noOfRoutes.secondRoute === "undefined") {
            deleteEncounter(currentEncounter._id);
          }
        }

        // ... give a notice on the console that the AJAX request for reading all routes has succeeded
        console.log("AJAX request (reading all encounters) is done successfully.");
      })

      // if the request has failed, ...
      .fail (function (xhr, status, error) {
        // ... give a notice that the AJAX request for reading all routes has failed and show the error-message on the console
        console.log("AJAX request (reading all encounters) has failed.", error.message);
      });
}



/**
 * this route checks, if the ajax-response contains a new route.
 * If the route is new, then the encounters are calculated for it.
 * @param response  the response of the ajax-request in readRoutesEncounters.js
 * @author name: Paula Scharf, matr.: 450 334
 */
function checkForNewRoute(response) {

  console.log("check for new routes");
  //
  for (let i = 0; i < response.length; i++) {
    let route = {
      _id: response[i]._id,
      status: response[i].status
    };
    //
    response[i].geoJson.features[0].geometry.coordinates = swapGeoJSONsLongLatToLatLongOrder(response[i].geoJson.features[0].geometry.coordinates);

    if(response[i].status == "new") {
      console.dir(response[i]);
      calculateEncounters(response[i].geoJson.features[0].geometry.coordinates, response[i]._id);

      updateStatusFromNewToOld(route);
    }
    alreadyKnownRoutes.push(response[i]);

    console.log("checked " + response[i]._id)
  }
}


/**
 * This function calculates all encounters of a given route with all other routes.
 * @param oneRoute  a route (only the coordinates)
 * @param oneId     id of oneRoute
 * @author name: Paula Scharf, matr.: 450 334
 */
function calculateEncounters(oneRoute, oneId) {
  //
  for (let i = 0; i < alreadyKnownRoutes.length; i++) {
    console.log("Compare: " + oneId + " with " + alreadyKnownRoutes[i]._id)
    intersectionOfRoutes(oneRoute, alreadyKnownRoutes[i].geoJson.features[0].geometry.coordinates, oneId, alreadyKnownRoutes[i]._id);
  }
}



/**
 * This function calculates the intersections of between all the straight lines that make up two given routes
 * @param firstRoute    a route (only the coordinates)
 * @param secondRoute   a second route (only the coordinates)
 * @param firstId       id of the first route
 * @param secondId      id of the second route
 * @author name: Paula Scharf, matr.: 450 334
 */
function intersectionOfRoutes(firstRoute, secondRoute, firstId, secondId) {
  //
  for(let i = 1; i < firstRoute.length; i++) {
    //
    for(let k = 1; k < secondRoute.length; k++) {
      //
      var result = getIntersection(firstRoute[i-1].lat, firstRoute[i-1].lng, firstRoute[i].lat, firstRoute[i].lng, secondRoute[k-1].lat, secondRoute[k-1].lng, secondRoute[k].lat, secondRoute[k].lng);
      //
      if(result.features.length > 0) {
        //
        let intersectionCoordinates = result.features[0].geometry.coordinates;
        let encounter = {
          type: "encounter",
          intersectionX: intersectionCoordinates[0],
          intersectionY: intersectionCoordinates[1],
          firstRoute: firstId,
          secondRoute: secondId
          //weather: new WeatherRequest(intersectionCoordinates),

        };
        console.log("encounter: ");
        console.log(encounter);
        postEncounter(encounter);
      }
    }
  }

}


/**
 * This function calculates the coordinates of an intersection between two straight lines.
 * If there is no intersection it returns false.
 * @param x11   x-coord of start of the first line
 * @param y11   y-coord of start of the first line
 * @param x12   x-coord of end of the first line
 * @param y12   y-coord of end of the first line
 * @param x21   x-coord of start of the second line
 * @param y21   y-coord of start of the second line
 * @param x22   x-coord of end of the second line
 * @param y22   y-coord of end of the second line
 * @returns array of coordinates | false
 * @author name: Paula Scharf, matr.: 450 334
 * @see https://stackoverflow.com/questions/13937782/calculating-the-point-of-intersection-of-two-lines
 */
function getIntersection(x11, y11, x12, y12, x21, y21, x22, y22) {
  var line1 = turf.lineString([[x11, y11], [x12, y12]]);
  var line2 = turf.lineString([[x21, y21], [x22, y22]]);
  var intersects = turf.lineIntersect(line1, line2);
  return intersects;
}



/**
 *
 *
 *
 */
function postEncounter(encounter) {
  //
  $.ajax({
    // use a http POST request
    type: "POST",
    // URL to send the request to
    url: "/encounter/post",
    data: encounter,
    // data type of the response
    dataType: "json"
  })

  // if the request is done successfully, ...
      .done (function (response) {
        console.log("response: ");
        console.log(response);
        // ... give a notice on the console that the AJAX request for pushing an encounter has succeeded
        console.log("AJAX request (pushing an encounter) is done successfully.");
      });
}

function deleteEncounter(encounterId) {
  $.ajax({
    // use a http POST request
    type: "GET",
    // URL to send the request to
    url: "/encounter/delete",
    data: {
      _id: encounterId
    },
    // data type of the response
    dataType: "json"
  })

  // if the request is done successfully, ...
      .done (function (response) {
        console.log("response: ");
        console.log(response);
        // ... give a notice on the console that the AJAX request for pushing an encounter has succeeded
        console.log("AJAX request (deleting an encounter) is done successfully.");
      });
}

function updateStatusFromNewToOld(route) {

  route.status = "old";
  console.log(route);


  $.ajax({
    // use a http POST request
    type: "POST",
    // URL to send the request to
    url: "/encounter/update",
    data: route,
    // data type of the response
    dataType: "json"
  })

  // if the request is done successfully, ...
      .done (function (response) {
        console.log("response: ");
        console.log(response);
        // ... give a notice on the console that the AJAX request for pushing an encounter has succeeded
        console.log("AJAX request (updating a route) is done successfully.");
      });

}

/**
 * Takes the coordinates of a route as valid GeoJSON (just the geometry.coordinates-part).This means this function takes one array (with all coordinates)
 * containing arrays (individual long-lat-pairs) of a route.
 * Swaps these coordinate-pairs. Returns one array containing objects (not arrays!) with the routes' coordinates as lat-long-pairs.
 *
 * @author Katharina Poppinga
 * @param longLatCoordinatesRoute - coordinates of a route as valid GeoJSON (just the geometry.coordinates-part, array containing arrays)
 * @return latLongCoordinatesRoute - one array containing objects (not arrays!) with the coordinates of the route as lat-long-pairs
 */
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
