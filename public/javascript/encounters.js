// jshint esversion: 6
// jshint maxerr: 1000

"use strict";  // JavaScript code is executed in "strict mode"

/**
* @desc final project, Geosoftware1, SoSe2019
* @author name: Katharina Poppinga, matr.: 450 146; name: Paula Scharf, matr.: 450 334
*/


/**
* Already known/processed routes.
* @type {Array}
*/
let alreadyKnownRoutes;



/**
* This function reads all routes from the database and also checks if some of them are new and therefor require a
* calculation of encounters.
* @author Paula Scharf, matr.: 450334
*/
function getAllRoutes() {

  $.ajax({
    // use a http GET request
    type: "GET",
    // URL to send the request to
    url: "/routes/readAll",
    // data type of the response
    dataType: "json",
    // timeout set to 20 seconds
    timeout: 20000
  })

  // if the request is done successfully, ...
  .done(function (response) {
    // make the response comply to the format of the allRoutes-array in readRoutesEncounters
    let allRoutes = [];
    for (let i = 0; i < response.length; i++) {
      allRoutes.push([response[i], true]);
      allRoutes[i][0].geoJson.features[0].geometry.coordinates = swapGeoJSONsLongLatToLatLongOrder_Arrays(allRoutes[i][0].geoJson.features[0].geometry.coordinates);
    }

    // check for routes with the status "new" and calculate encounters for said routes
    checkForNewRoute(allRoutes, false);

    // ... give a notice on the console that the AJAX request for reading all routes has succeeded
    console.log("AJAX request (reading all routes) is done successfully.");
  })

  // if the request has failed, ...
  .fail(function (xhr, status, error) {
    // ... give a notice that the AJAX request for reading all routes has failed and show the error on the console
    console.log("AJAX request (reading all routes) has failed.", error);

    // send JSNLog message to the own server-side to tell that this ajax-request has failed because of a timeout
    if (error === "timeout") {
      JL("ajaxReadingAllRoutesTimeout").fatalException("ajax: '/routes/readAll' timeout");
    }
  });
}



/**
* This route checks, if the AJAX-response contains a new route.
* If the route is new, then the encounters are calculated for it.
* @param {object} response          the response of the ajax-request in readRoutesEncounters.js
* @param checkForUpdates   if true, also delete the old encounters associated with a new route
* @author Paula Scharf, matr.: 450334
*/
function checkForNewRoute(response, checkForUpdates) {
  alreadyKnownRoutes = [];

  // go through all routes
  for (let i = 0; i < response.length; i++) {
    let currentRoute = response[i];
    let route = {
      _id: currentRoute[0]._id,
      status: "old"
    };

    if (currentRoute[0].status === "new") {
      // calculate the encounters with other routes
      calculateEncounters(currentRoute[0].geoJson.features[0].geometry.coordinates, currentRoute[0]._id, checkForUpdates);
      // after the encounters of a route are calculated, its status is set to old
      updateStatusFromNewToOld(route);
    }
    else if (currentRoute[0].status === "updated") {
      let temp = alreadyKnownRoutes;
      alreadyKnownRoutes = response;
      deleteAllEncountersOfRoute(currentRoute[0]._id);
      // calculate the encounters with other routes
      calculateEncounters(currentRoute[0].geoJson.features[0].geometry.coordinates, currentRoute[0]._id, checkForUpdates);
      // after the encounters of a route are calculated, its status is set to old
      updateStatusFromNewToOld(route);

      alreadyKnownRoutes = temp;
    }

    // the now processed route is added to the other already processed routes
    alreadyKnownRoutes.push(currentRoute);
  }
}


/**
* This function deletes all encounters which are associated to the route with the given ID.
* @param routeId - the ID of the route
* @author Paula Scharf, matr.: 450334
*/
function deleteAllEncountersOfRoute(routeId) {

  // go through all encounters
  for (let i = 0; i < allEncounters.length; i++) {
    let currentEncounter = allEncounters[i][0];
    if (currentEncounter.firstRoute === routeId || currentEncounter.secondRoute === routeId) {
      // delete the encounter from the allEncounters-Array
      allEncounters.splice(i, 1);
      // delete the encounter from the database
      deleteEncounter(currentEncounter._id);
      i = i-1;
    } else {
      // go through all routes, to determine their index in the allRoutes-array and give that information
      // to the encounter
      for (let k = 0; k < allRoutes.length; k++) {
        if (allRoutes[k][0]._id === currentEncounter.firstRoute) {
          currentEncounter.firstRoute = k;
        }
        else if (allRoutes[k][0]._id === currentEncounter.secondRoute) {
          currentEncounter.secondRoute = k;
        }
      }
    }
  }
}


/**
* This function calculates all encounters of a given route with all other routes.
* @param oneRoute        -  a route (only the coordinates)
* @param oneId           -  ID of oneRoute
* @param checkForUpdates -
* @author Paula Scharf, matr.: 450334
*/
function calculateEncounters(oneRoute, oneId, checkForUpdates) {

  // go through all aready processed routes and calculate intersections between them and the given route
  for (let i = 0; i < alreadyKnownRoutes.length; i++) {
    // if the current route is set to updated, then it will be processed again later
    if (oneId !== alreadyKnownRoutes[i][0]._id || alreadyKnownRoutes[i][0].status !== "updated") {
      intersectionOfRoutes(oneRoute, alreadyKnownRoutes[i][0].geoJson.features[0].geometry.coordinates, oneId, alreadyKnownRoutes[i][0]._id, checkForUpdates);
    }
  }
}


/**
* This function calculates encounters between two routes and posts them to the database (and if needed adds the to
* the "allEncounters"-Array.
* @param firstRoute        a route (only the coordinates)
* @param secondRoute       a second route (only the coordinates)
* @param firstId           ID of the first route
* @param secondId          ID of the second route
* @param checkForUpdates   if true, add the new encounter to the allEncounters-array
* @author Paula Scharf, matr.: 450334
*/
function intersectionOfRoutes(firstRoute, secondRoute, firstId, secondId, checkForUpdates) {

  let line1 = turf.lineString(firstRoute);
  let line2 = turf.lineString(secondRoute);
  // these nested for-loops go through all adjascent point pairs in each route
  // check for intersections between two lines
  let result = turf.lineIntersect(line1, line2);
  // if the result contains coordinates, then there is an intersection
  result.features.forEach((intersection) => {
    // create an encounter object for the calculated intersection
    let encounter = {
      what: "encounter",
      intersectionX: intersection.geometry.coordinates[0],
      intersectionY: intersection.geometry.coordinates[1],
      firstRoute: firstId,
      secondRoute: secondId,
      tookPlace: "maybe"
    };
    let copyOfEncounter = encounter;

    // add the new encounter to the allEncounters-array, if it was created because a route was updated
    if (checkForUpdates) {
      console.log("add the encounter to the array")
      let noOfRoutes = {firstRoute: undefined, secondRoute: undefined};
      // go through all routes, to determine their index in the allRoutes-array and give that information
      // to the encounter
      for (let k = 0; k < allRoutes.length; k++) {
        if (allRoutes[k][0]._id === encounter.firstRoute) {
          noOfRoutes.firstRoute = k;
        }
        else if (allRoutes[k][0]._id === encounter.secondRoute) {
          noOfRoutes.secondRoute = k;
        }
      }
      if (typeof encounter.firstRoute !== "undefined" && encounter.secondRoute !== "undefined") {
        let parameters = {
          routesSelected: true,
          search: "no search"
        };
        // give true as the second argument to indicate that the encounter should be visible on the map
        // and in the table
        allEncounters.push([encounter, parameters, noOfRoutes]);
      }
    }
    let index;
    if (typeof allEncounters !== "undefined") {
      index = allEncounters.length-1;
    }
    // save the new encounter in the database
    getNewTerrainRequest(copyOfEncounter);
  });
}


/**
* This function calls the '/encounter/create' route with AJAX, to save a given encounter in the database.
* @author Paula Scharf, matr.: 450334
 * @param encounter - the encounter to be saved
 * @param id - the index of the encounter in the global encounters-array ("allEncounters")
 */
function postEncounter(encounter, id) {

  $.ajax({
    // use a http POST request
    type: "POST",
    // URL to send the request to
    url: "/encounter/create",
    // type of the data that is sent to the server
    contentType: "application/json; charset=utf-8",
    // data to send to the server
    data: JSON.stringify(encounter),
    // timeout set to 15 seconds
    timeout: 15000
  })

  // if the request is done successfully, ...
  .done (function (response) {
    if (typeof id !== "undefined") {
      allEncounters[id][0]._id = response;
      shareButton(id);
    }
    // ... give a notice on the console that the AJAX request for pushing an encounter has succeeded
    console.log("AJAX request (posting an encounter) is done successfully.");
  })

  // if the request has failed, ...
  .fail(function (xhr, status, error) {
    // ... give a notice that the AJAX request for posting an encounter has failed and show the error on the console
    console.log("AJAX request (posting an encounter) has failed.", error);

    // send JSNLog message to the own server-side to tell that this ajax-request has failed because of a timeout
    if (error === "timeout") {
      JL("ajaxCreatingEncounterTimeout").fatalException("ajax: '/encounter/create' timeout");
    }
  });
}


/**
* This function calls the '/encounter/delete' route with AJAX, to delete an encounter with a given ID from the database.
* @param encounterId   - the ID of the encounter
* @author Paula Scharf, matr.: 450334
*/
function deleteEncounter(encounterId) {

  $.ajax({
    // use a http GET request
    type: "GET",
    // URL to send the request to
    url: "/encounter/delete",
    // data to send to the server
    data: {
      _id: encounterId
    },
    // timeout set to 15 seconds
    timeout: 15000
  })

  // if the request is done successfully, ...
  .done (function (response) {
    // ... give a notice on the console that the AJAX request for pushing an encounter has succeeded
    console.log("AJAX request (deleting an encounter) is done successfully.");
  })

  // if the request has failed, ...
  .fail(function (xhr, status, error) {
    // ... give a notice that the AJAX request for deleting an encounter has failed and show the error on the console
    console.log("AJAX request (deleting an encounter) has failed.", error);

    // send JSNLog message to the own server-side to tell that this ajax-request has failed because of a timeout
    if (error === "timeout") {
      JL("ajaxDeletingEncounterTimeout").fatalException("ajax: '/encounter/delete' timeout");
    }
  });
}


/**
* This function calls the '/encounter/update' route with AJAX, to update a route in the database.
* @param route - the new route
* @author Paula Scharf, matr.: 450334
*/
function updateStatusFromNewToOld(route) {

  $.ajax({
    // use a http POST request
    type: "POST",
    // URL to send the request to
    url: "/encounter/update",
    // type of the data that is sent to the server
    contentType: "application/json; charset=utf-8",
    // data to send to the server
    data: JSON.stringify(route),
    // timeout set to 15 seconds
    timeout: 15000
  })

  // if the request is done successfully, ...
  .done (function (response) {
    // ... give a notice on the console that the AJAX request for updating the status of a route has succeeded
    console.log("AJAX request (updating the status of a route) is done successfully.");
  })

  // if the request has failed, ...
  .fail(function (xhr, status, error) {
    // ... give a notice that the AJAX request for updating the status of a route has failed and show the error on the console
    console.log("AJAX request (updating the status of a route) has failed.", error);

    // send JSNLog message to the own server-side to tell that this ajax-request has failed because of a timeout
    if (error === "timeout") {
      JL("ajaxUpdatingEncounterTimeout").fatalException("ajax: '/encounter/update' timeout");
    }
  });
}


// ***************** loading spinner *****************

// if AJAX starts, show the loading spinner
$(document).ajaxStart(function () {
  $('.loading').show();
});

// if AJAX finishes, hide the loading spinner
// in case of an error, the loading spinner keeps spinning
$(document).ajaxStop(function () {
  $('.loading').hide();
});
