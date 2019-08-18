// jshint esversion: 6
// jshint maxerr: 1000

"use strict";  // JavaScript code is executed in "strict mode"

/**
* @desc final project, Geosoftware1, SoSe2019
* @author name: Katharina Poppinga, matr.: 450 146; name: Paula Scharf, matr.: 450 334
*/

// please put in your own tokens at 'token.js'


// ****************************** global variables ******************************

/**
* A JSON-object which contains all needed data of the specific animal and its route as a GeoJSON FeatureCollection.
* @type {Object}
*/
let animalRoute;


/**
* A Leaflet-map in which the chosen animal route is shown.
* @type {Map}
*/
let createAnimalRouteMap;


/**
* A leaflet-layerGroup for the chosen animal route.
* @type {layerGroup}
*/
let animalRoutesGroup;


// ********************************* functions *********************************

/**
* Sets up the leaflet-map 'createAnimalRouteMap' with OpenStreetMap tiles and
* creates a leaflet-layerGroup for this map.
*
* @author Katharina Poppinga, matr.: 450146
*/
function showAnimalMap() {

  // hide the loading spinner
  $('.loading').hide();

  // create the initial map in the "createAnimalRouteMap"-div
  createAnimalRouteMap = L.map('createAnimalRouteMap').setView([0, 0], 2);

  // OpenStreetMap tiles as a layer for the map "createAnimalRouteMap"
  let oSMLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  });

  // add the OpenStreetMap tile layer to the map "createAnimalRouteMap"
  oSMLayer.addTo(createAnimalRouteMap);

  // create a layerGroup for animal routes, add this group to the existing map "createAnimalRouteMap"
  animalRoutesGroup = L.layerGroup().addTo(createAnimalRouteMap);
}


/**
* This function makes an AJAX-request to get individual identifiers for a specific studyID from Movabank API.
* @private
* @author Paula Scharf, matr.: 450334
*/
function getIndividualID() {

  document.getElementById('animalName').innerHTML = "";
  document.getElementById('animalDateTime').innerHTML = "";

  animalRoutesGroup.clearLayers();

  document.getElementById("individualIdDiv").style.display = "none";
  document.getElementById("getAnimalRouteDiv").style.display = "none";

  animalRoute = undefined;

  let studyID = document.getElementById('studyID').value;

  let iD = {
    studyID: studyID
  };

  // ********** AJAX request for getting animal tracking data from Movebank API **********
  $.ajax({
    // use a http POST request
    type: "POST",
    // URL to send the request to
    url: "/animalTrackingAPI/individualIds",
    // type of the data that is sent to the server
    contentType: "application/json; charset=utf-8",
    // data to send to the server
    data: JSON.stringify(iD),
    //
    xhrFields: {
      withCredentials: true
    },
    // timeout set to 10 seconds
    timeout: 10000
  })

  // if the request is done successfully, ...
  .done (function (response) {

    // ... give a notice on the console that the AJAX request for getting the animal tracking API data has succeeded
    console.log("AJAX request (getting individual Ids) is done successfully.");

    if (typeof response.errorMessage !== "undefined") {
      if (response.errorMessage === "There was an error.") {
        alert("There was an error. Please try another input.");
      }
    } else {

      document.getElementById("individualIdDiv").style.display = "block";

      showAnimalIDs(response);
    }
  })

  // if the request has failed, ...
  .fail (function (xhr, status, error) {
    // ... give a notice that the AJAX request for getting the animal tracking API data has failed and show the error on the console
    console.log("AJAX request (getting animal tracking data from API) has failed.", error);
    alert("There was an error. Please try again later.");

    // send JSNLog message to the own server-side to tell that this ajax-request has failed because of a timeout
    if (error === "timeout") {
      JL("ajaxGettingAnimalTrackingAPITimeout").fatalException("ajax: '/animalTrackingAPI/individualIds' timeout");
    }
  });
}


/**
* This function takes the response of the AJAX-request for getting individual identifiers of a study and displays it in
* a dropdown menu on the page.
* @private
* @author Paula Scharf, matr.: 450334
*/
function showAnimalIDs(response) {

  $('#individualID').empty();
  let select = document.getElementById("individualID");

  // make a new option in the dropdown for every identifier
  for (let i = 0; i < response.length; i++) {
    select.options[select.options.length] = new Option(response[i].local_identifier, response[i].local_identifier);
  }
}


/**
* Makes an AJAX-POST-request for getting the animal tracking data for a given studyID,
* a given individualID and a given max. number of locations from Movebank API. Reads these
* three attributes out of its corresponding elements in the createAnimalRoute.ejs.
* Calls a function for formatting and showing the AJAX-response on createAnimalRoute.ejs.
*
* @private
* @author Katharina Poppinga, matr.: 450146, Paula Scharf, matr.: 450334
*/
function getTrackingData() {

  // reset the section for showing the chosen animal route
  document.getElementById("getAnimalRouteDiv").style.display = "none";
  animalRoutesGroup.clearLayers();
  animalRoute = undefined;

  // get the user inputs needed for the AJAX-request
  let studyID = document.getElementById('studyID').value;
  let individualID = document.getElementById('individualID').value;
  let maxEventsPerIndividual = document.getElementById('maxEventsPerIndividual').value;

  // prepare the data given by the user to send with AJAX
  let iDs = {
    studyID: studyID,
    individualID: individualID,
    maxEventsPerIndividual: maxEventsPerIndividual
  };


  // ********** AJAX request for getting animal tracking data from movebank API **********
  $.ajax({
    // use a http POST request
    type: "POST",
    // URL to send the request to
    url: "/animalTrackingAPI",
    // type of the data that is sent to the server
    contentType: "application/json; charset=utf-8",
    // data to send to the server
    data: JSON.stringify(iDs),
    //
    xhrFields: {
      withCredentials: true
    },
    // timeout set to 10 seconds
    timeout: 10000
  })

  // if the request is done successfully, ...
  .done (function (response) {

    // ... give a notice on the console that the AJAX request for getting the animal tracking API data has succeeded
    console.log("AJAX request (getting animal tracking data from API) is done successfully.");

    // if the response has data about an individual animal ...
    if (response.individuals.length > 0) {
      // ... provide the section to show
      document.getElementById("individualIdDiv").style.display = "block";
      document.getElementById("getAnimalRouteDiv").style.display = "block";

      // format and show the data about that animal
      formatAndShowAnimalRoute(response);

      // if the response does not provide data about an individual animal, tell the user about it
    } else {
      alert("This individual doesnt seem to have any data stored. \n " +
      "Please try a different individual or study.");
    }
  })

  // if the request has failed, ...
  .fail (function (xhr, status, error) {
    // ... give a notice that the AJAX request for getting the animal tracking API data has failed and show the error on the console
    console.log("AJAX request (getting animal tracking data from API) has failed.", error);

    // send JSNLog message to the own server-side to tell that this ajax-request has failed because of a timeout
    if (error === "timeout") {
      JL("ajaxGettingAnimalTrackingAPITimeout").fatalException("ajax: '/animalTrackingAPI' timeout");
    }
  });
}


/**
* Takes the needed attributes out of the response of the AJAX-request for the animal tracking data of one animal.
* Formats them in form of converting the timestamps unit and making a continuous route (in GeoJSOn syntax)
* out of the gotten coordinates. Adds a few other attributes needed for processing and makes
* an JSON-object of this animal route. Calls a function for showing the route on createAnimalRoute.ejs.
*
* @private
* @author Katharina Poppinga, matr.: 450146
* @param response response of the AJAX-request for getting tracking data of one animal from Movebank API
*/
function formatAndShowAnimalRoute(response) {

  // make a route-object (in GeoJSON syntax) out of the given animal coordinates
  let locations = response.individuals[0].locations;
  let animalRouteGeoJSON = makeAnimalRouteGeoJSON(locations);

  // requested timestamps are provided in milliseconds since 1970-01-01 UTC,
  // convert these Epoch milliseconds to our local date and time format:
  // for this, get the timestamp of the first coordinate of the animal route
  // (it is only one timestamp saved for one route, like it is for the user routes, too)
  let firstTimestampEpochMilli = response.individuals[0].locations[0].timestamp;
  let firstTimestamp = new Date(firstTimestampEpochMilli);
  let date = firstTimestamp.toLocaleDateString();
  let time = firstTimestamp.toLocaleTimeString();


  // create the JSON-object for the animal route
  animalRoute = {
    // get the study-id
    study_id: response.individuals[0].study_id,
    // get the individual-id
    individual_id: response.individuals[0].individual_local_identifier,
    // get the taxon
    individualTaxonCanonicalName: response.individuals[0].individual_taxon_canonical_name,
    // geoJson of the route
    geoJson: animalRouteGeoJSON,
    // date of the first entry in the locations-array
    date: date,
    // time of the first entry in the locations-array
    time: time,
    // to distinguish between user routes and animal routes
    madeBy: "animal",
    // to distinguish between routes and encounters
    what: "route",
    // this route will be new in the database
    status: "new"
  };

  // show the animal route to the user, on createAnimalRoute.ejs
  showAnimalRoute(animalRoute);
}


/**
* Takes the locations-part of the tracking data of one animal and makes a route
* (in GeoJSON syntax, FeatureCollection) out of all its lat- and long-coordinate-pairs.
*
* @private
* @author Katharina Poppinga, matr.: 450146
* @param locations array containing objects with (a timestamp - not needed in this function - and) a long- and a lat-coordinate each
* @return animalRouteGeoJSON - the animal route as a GeoJSON FeatureCollection
*/
function makeAnimalRouteGeoJSON(locations) {

  // coordinates are in WGS84

  // new array for the coordinates of the route, written in GeoJSON (only the geometry.coordinates part of the GeoJSON format)
  let coordinatesGeoJSON = [];

  // long- and lat-coordinates out of the locations-array
  let lat, long;
  // loop "over" all objects/coordinate-pairs in the locations-array
  for (let i = 0; i < locations.length; i++) {

    // adding the i-th coordinate-pair to the new array coordinatesGeoJSON
    lat = locations[i].location_lat;
    long = locations[i].location_long;
    coordinatesGeoJSON.push([long, lat]);
  }

  // creating the GeoJSON FeatureCollection output by setting its attributes:
  return {
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        properties: {},
        geometry: {
          type: "LineString",
          // insert the new array coordinatesGeoJSON
          coordinates: coordinatesGeoJSON
        }
      }
    ]
  };
}


/**
* Takes an animal route (JSON-object with all data of the specific animal and its route)
* and shows the individual taxon canonical name of the animal, the date and time of its first
* coordinate and the route (in the map) on createAnimalRoute.ejs.
*
* @private
* @author Katharina Poppinga, matr.: 450146
* @param animalRoute JSON-object with all data of the specific animal and its route
*/
function showAnimalRoute(animalRoute) {

  // show the individual taxon canonical name of the animal and the date and time of its first coordinate on createAnimalRoute.ejs
  document.getElementById('animalName').innerHTML = animalRoute.individualTaxonCanonicalName;
  document.getElementById('animalDateTime').innerHTML = animalRoute.date + ", " + animalRoute.time;


  // **************** show animal route in map "createAnimalRouteMap" ****************

  // animalRouteGeoJSON is an object
  let animalRouteGeoJSON = animalRoute.geoJson;

  // extract the coordinates of the animal route
  let coordinatesGeoJSON = animalRouteGeoJSON.features[0].geometry.coordinates;

  // swap the coordinates and make an object of each of them to be able to make a leaflet-polyline out of the route
  let coordinatesLatLong = swapGeoJSONsLongLatToLatLongOrder_Objects(coordinatesGeoJSON);

  // center the map on the first point of the animal route
  createAnimalRouteMap.setView([coordinatesLatLong[0].lat, coordinatesLatLong[0].lng], 4);

  // make a leaflet-polyline from the coordinates and show this polyline in orange in the map
  let polylineOfRoute = L.polyline(coordinatesLatLong, {color: '#ec7e00'}, {weight: '3'});
  polylineOfRoute.addTo(animalRoutesGroup);
}


/**
* Inserts a user chosen animal route into the database, using an AJAX-POST-request. Before inserting,
* its JSON and GeoJSON (route-part) syntax is checked, because it is a global variable that is inserted.
*
*
* @author Katharina Poppinga, matr.: 450146
*/
function postAnimalRoute() {

  // animalRoute as a String
  let animalRouteString;

  // if there is no animal route gotten/chosen from movebank API ...
  if (typeof animalRoute === "undefined") {
    // ... tell the user that he/she first has to choose an animal route by getting tracking data of a study from movebank API
    alert("First, you have to choose an animal route by getting tracking data of a study from movebank API.");
  }
  // if there is an animal route gotten/chosen from movebank API,
  // check the syntax because animalRoute is a global variable
  else {
    // check whether animalRoute is valid JSON that can be parsed
    try {
      animalRouteString = JSON.stringify(animalRoute);
    }
    // if the animalRoute is not valid JSON, throw an exception, tell the user and do not continue
    catch (exception){
      alert("The animal route has no valid JSON syntax.\n" + exception);
      return;
    }

    // check whether exactly this route is already stored in the database to
    // prevent from inserting it again (that would cause much encounter-calculating and could paralyze the app)
    $.ajax({
      // use a http POST request
      type: "POST",
      // URL to send the request to
      url: "/routes/readAnimal",
      // data to send to the server, send as String for independence of server-side programming language
      data: animalRouteString,
      // type of the data that is sent to the server
      contentType: "application/json; charset=utf-8",
      // timeout set to 7 seconds
      timeout: 7000
    })

    // if the request is done successfully, ...
    .done (function (response) {

      // if the chosen route already exists in the database ...
      if (response !== "") {

        // ... reset the section for showing the chosen animal route
        document.getElementById('animalName').innerHTML = "";
        document.getElementById('animalDateTime').innerHTML = "";
        document.getElementById("getAnimalRouteDiv").style.display = "none";
        animalRoutesGroup.clearLayers();
        animalRoute = undefined;

        // ... and tell the user about it
        alert("This animal route is already stored in the database. Please choose a different one.");
        // ... and do not call the following expressions so that the user can choose a different route
        return;

        // if this route does not exist in the database ...
      } else {
        // ... check whether 'animalRoute.geoJson' contains valid GeoJSON and, if so, ...
        if (validateGeoJSON(animalRoute.geoJson)) {

          // ... insert the chosen animal route into the database
          insertAnimalroute();

          // if 'animalRoute.geoJson' does not contain valid GeoJSON, tell the user and do not insert into database
        } else {
          alert("The GeoJSON-part of the animal route has no valid syntax.");
        }
      }
    })

    // if the AJAX-request has failed, ...
    .fail (function (xhr, status, error) {

      // ... give a notice that the AJAX request for finding the animal route has failed and show the error on the console
      console.log("AJAX request (reading/finding animal route) has failed.", error);

      // send JSNLog message to the own server-side to tell that this ajax-request has failed because of a timeout
      if (error === "timeout") {
        JL("ajaxReadingAnimalrouteTimeout").fatalException("ajax: '/routes/readAnimal' timeout");
      }
    });
  }
}


/**
* Makes an AJAX-POST-reqest for inserting an animal route into the database and
* calls a function for calculating new encounters.
*
* @private
* @author Katharina Poppinga, matr.: 450146
*/
function insertAnimalroute(){

  // ********** AJAX request for posting the animal route into the database "routeDB" **********
  $.ajax({
    // use a http POST request
    type: "POST",
    // URL to send the request to
    url: "/routes/createAnimal",
    // data to send to the server, send as String for independence of server-side programming language
    data: JSON.stringify(animalRoute),
    // type of the data that is sent to the server
    contentType: "application/json; charset=utf-8",
    // timeout set to 10 seconds
    timeout: 10000
  })

  // if the request is done successfully, ...
  .done (function (response) {

    // if the AJAX-request was successful but the inserting itself was not ...
    if (response === "") {
      // ... tell the user about it
      alert("The animal route could not be inserted into the database.");

      // after successfully inserted the animal route in to the database ...
    } else {
      // ... reset the section for showing the chosen animal route
      document.getElementById('animalName').innerHTML = "";
      document.getElementById('animalDateTime').innerHTML = "";
      document.getElementById("getAnimalRouteDiv").style.display = "none";
      animalRoutesGroup.clearLayers();
      animalRoute = undefined;

      // ... and tell the user about the success in inserting the animal route
      alert("The animal route was successfully inserted into the database.");

      // calculate new encounters
      getAllRoutes();
    }

    // ... give a notice on the console that the AJAX request for posting the animal route has succeeded
    console.log("AJAX request (posting animal route) is done successfully.");
  })

  // if the request has failed, ...
  .fail (function (xhr, status, error) {

    // ... give a notice that the AJAX request for posting the animal route has failed and show the error on the console
    console.log("AJAX request (posting animal route) has failed.", error);

    // send JSNLog message to the own server-side to tell that this ajax-request has failed because of a timeout
    if (error === "timeout") {
      JL("ajaxCreatingAnimalrouteTimeout").fatalException("ajax: '/routes/createAnimal' timeout");
    }
  });
}
