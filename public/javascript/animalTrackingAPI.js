// jshint esversion: 6
// jshint maxerr: 1000

"use strict";  // JavaScript code is executed in "strict mode"

/**
* @desc final project, Geosoftware1, SoSe2019
* @author name: Katharina Poppinga, matr.: 450 146; name: Paula Scharf, matr.: 450 334
*/

// please put in your own tokens at 'token.js'


// JSDoc: * @throws request failed: [object ProgressEvent]


// TODO: KOMMENTARE, JSDoc


// ****************************** global variables ******************************


// TODO:
/**
* Global variable which ....
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
*
*
*
* @author Katharina Poppinga, matr.: 450146
*/
function showAnimalMapData() {

  // create the initial map in the "createAnimalRouteMap"-div
  createAnimalRouteMap = L.map('createAnimalRouteMap').setView([0, 0], 2);

  // OpenStreetMap tiles as a layer for the map "createAnimalRouteMap"
  let oSMLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  });

  // add the OpenStreetMap tile layer to the map "createAnimalRouteMap"
  oSMLayer.addTo(createAnimalRouteMap);

  // create a layerGroup for animalroutes, add this group to the existing map "createAnimalRouteMap"
  animalRoutesGroup = L.layerGroup().addTo(createAnimalRouteMap);
}


/**
* This function makes an AJAX-request to get individual identifiers for a specific studyID.
* @private
* @author Paula Scharf, matr.: 450334
*/
function getIndividualID() {
  //
  document.getElementById('animalName').innerHTML = "";
  document.getElementById('animalDateTime').innerHTML = "";

  //
  animalRoutesGroup.clearLayers();

  document.getElementById("individualIdDiv").style.display = "none";
  document.getElementById("getAnimalRouteDiv").style.display = "none";

  animalRoute = undefined;

  let studyID = document.getElementById('studyID').value;

  //
  let iD = {
    studyID: studyID
  };

  // ********** AJAX request for getting animal tracking data from movebank API **********
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

      //
      showAnimalIds(response);
    }
  })

  // if the request has failed, ...
  .fail (function (xhr, status, error) {
    // ... give a notice that the AJAX request for getting the animal tracking API data has failed and show the error on the console
    console.log("AJAX request (getting animal tracking data from API) has failed.", error);
    alert("There was an error. Please try again later.");

    // TODO: ÜBERPRÜFEN, OB SCHREIBWEISE RICHTIG
    // send JSNLog message to the own server-side to tell that this ajax-request has failed because of a timeout
    if (error === "timeout") {
      JL("ajaxGettingAnimalTrackingAPITimeout").fatalException("ajax: '/animalTrackingAPI/individualIds' timeout");
    }
  });
}


/**
* This function takes the response of the AJAX-request for getting individual identiefiers of a study and displays it in
* a dropdown menu on the page.
* @private
* @author Paula Scharf, matr.: 450334
*/
function showAnimalIds(response) {
  let select = document.getElementById("individualID");

  // make a new option in the dropdown for every identifier
  for (let i = 0; i < response.length; i++) {
    select.options[select.options.length] = new Option(response[i].local_identifier, response[i].local_identifier);
  }
}


/**
*
*
* @author Katharina Poppinga, matr.: 450146, Paula Scharf, matr.: 450334
*/
function getTrackingData() {
  //
  document.getElementById('animalName').innerHTML = "";
  document.getElementById('animalDateTime').innerHTML = "";

  //
  animalRoutesGroup.clearLayers();

  document.getElementById("getAnimalRouteDiv").style.display = "none";

  animalRoute = undefined;

  //
  let studyID = document.getElementById('studyID').value;
  let individualID = document.getElementById('individualID').value;
  let maxEventsPerIndividual = document.getElementById('maxEventsPerIndividual').value;

  //
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

    console.log(response);

    // ... give a notice on the console that the AJAX request for getting the animal tracking API data has succeeded
    console.log("AJAX request (getting animal tracking data from API) is done successfully.");

    //
    if (response.individuals.length > 0) {
      document.getElementById("individualIdDiv").style.display = "block";
      document.getElementById("getAnimalRouteDiv").style.display = "block";

      formatAndShowAnimalRoute(response);

      //
    } else {
      alert("This individual doesnt seem to have any data stored. \n " +
      "Please try a different individual or study.");
    }
  })

  // if the request has failed, ...
  .fail (function (xhr, status, error) {
    // ... give a notice that the AJAX request for getting the animal tracking API data has failed and show the error on the console
    console.log("AJAX request (getting animal tracking data from API) has failed.", error);

    // TODO: ÜBERPRÜFEN, OB SCHREIBWEISE RICHTIG
    // send JSNLog message to the own server-side to tell that this ajax-request has failed because of a timeout
    if (error === "timeout") {
      JL("ajaxGettingAnimalTrackingAPITimeout").fatalException("ajax: '/animalTrackingAPI' timeout");
    }
  });
}


/**
* Takes the response of the Animal Tracking API request .....................
* and ......
*
*
* @private
* @author Katharina Poppinga, matr.: 450146
* @param response response of the ......... request ........
*/
function formatAndShowAnimalRoute(response) {

  //
  let locations = response.individuals[0].locations;

  // animalRouteGeoJSON is an object
  let animalRouteGeoJSON = makeAnimalRouteGeoJSON(locations);

  // timestamps are provided in milliseconds since 1970-01-01 UTC
  // get the timestamp of the first coordinate of the animalroute (it is only one timestamp saved for one route, like it is for the userroutes, too)
  let firstTimestampEpochMilli = response.individuals[0].locations[0].timestamp;

  // convert Epoch milliseconds to our local date and time format
  let firstTimestamp = new Date(firstTimestampEpochMilli);
  let date = firstTimestamp.toLocaleDateString();
  let time = firstTimestamp.toLocaleTimeString();


  // create ....
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
    // to distinguish between userroutes and animalroutes
    madeBy: "animal",
    // to distinguish between routes and encounters
    what: "route",
    // this route will be new in the database
    status: "new"
  };

  //
  showAnimalRoute(animalRoute);
}


/**
* Takes the locations-part of the response from the animal tracking API .....................
* and makes a route (as a GeoJSON feature) from/of the individual lat- and long-coordinates.......
*
*
* @private
* @author Katharina Poppinga, matr.: 450146
* @param locations array of ...............
* @return animalRouteGeoJSON - the locations of the animalroute as a GeoJSON FeatureCollection
*/
function makeAnimalRouteGeoJSON(locations) {

  // coordinates are in WGS84

  // new array for the coordinates of the route, written in GeoJSON (only the geometry.coordinates part of the GeoJSON format)
  let coordinatesGeoJSON = [];

  //
  let lat, long;
  //
  for (let i = 0; i < locations.length; i++) {

    //
    lat = locations[i].location_lat;
    long = locations[i].location_long;

    // adding the i-th coordinate-pair to the new array coordinatesGeoJSON
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
*
*
*
* @private
* @author Katharina Poppinga, matr.: 450146
* @param animalRoute
*/
function showAnimalRoute(animalRoute) {

  //
  document.getElementById('animalName').innerHTML = animalRoute.individualTaxonCanonicalName;
  document.getElementById('animalDateTime').innerHTML = animalRoute.date + ", " + animalRoute.time;


  // **************** show animalroute in map "createAnimalRouteMap" ****************

  // animalRouteGeoJSON is an object
  let animalRouteGeoJSON = animalRoute.geoJson;
  // let animalRouteGeoJSON = JSON.parse(animalRoute.geoJson);

  // extract the coordinates of the animalroute
  let coordinatesGeoJSON = animalRouteGeoJSON.features[0].geometry.coordinates;

  //
  let coordinatesLatLong = swapGeoJSONsLongLatToLatLongOrder_Objects(coordinatesGeoJSON);

  // ... center the map on the first point of the animalroute
  createAnimalRouteMap.setView([coordinatesLatLong[0].lat, coordinatesLatLong[0].lng], 4);

  // make a leaflet-polyline from the coordinates and show this polyline in orange in the map
  let polylineOfRoute = L.polyline(coordinatesLatLong, {color: '#ec7e00'}, {weight: '3'});
  //
  polylineOfRoute.addTo(animalRoutesGroup);
}


/**
*
*
*
* @author Katharina Poppinga, matr.: 450146
*/
function postAnimalRoute() {

  // if there is no animalroute gotten/chosen from movebank API ...
  if (typeof animalRoute === "undefined") {
    // ... tell the user that he/she first has to choose an animalroute by getting tracking data of a study from movebank API
    alert("First, you have to choose an animalroute by getting tracking data of a study from movebank API.");
  }
  // if there is an animalroute gotten/chosen from movebank API,
  // check the syntax because animalRoute is a global variable
  else {

    // check whether animalRoute is valid JSON that can be parsed, if not throw an exception, tell the user and do not continue
    try {
      JSON.stringify(animalRoute);
    }
    catch (exception){
      //
      alert("The animalroute has no valid JSON syntax.\n" + exception);
      // .........
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
      data: JSON.stringify(animalRoute),
      // type of the data that is sent to the server
      contentType: "application/json; charset=utf-8",
      // timeout set to 7 seconds
      timeout: 7000
    })

    // if the request is done successfully, ...
    .done (function (response) {

      console.log(response);

      // if the chosen route already exists in the database ...
      if (response !== "") {
        //
        document.getElementById('animalName').innerHTML = "";
        document.getElementById('animalDateTime').innerHTML = "";


        document.getElementById("getAnimalRouteDiv").style.display = "none";

        //
        animalRoutesGroup.clearLayers();
        //
        animalRoute = undefined;
        // ... tell the user about it
        alert("This animalroute is already stored in your database. Please choose a different one.");
        // ... and do not call the following expressions so that the user can choose a different route
        return;

        // if this route does not exist in the database ...
      } else {
        // ... check whether 'animalRoute.geoJson' contains valid GeoJSON and, if so, ...
        if (validateGeoJSON(animalRoute.geoJson)) {

          // TODO: SO WÄRE VALIDIERUNG DÄMLICH
          // ... insert the chosen animalroute into the database
          insertAnimalroute();

          // if 'animalRoute.geoJson' does not contain valid GeoJSON, tell the user and do not insert into database
        } else {
          alert("The GeoJSON-part of the animalroute has no valid syntax.");
        }
      }
    })

    // if the ajax-request has failed, ...
    .fail (function (xhr, status, error) {

      // ... give a notice that the AJAX request for finding the animalroute has failed and show the error on the console
      console.log("AJAX request (reading/finding animalroute) has failed.", error);

      // TODO: ÜBERPRÜFEN, OB SCHREIBWEISE RICHTIG
      // send JSNLog message to the own server-side to tell that this ajax-request has failed because of a timeout
      if (error === "timeout") {
        JL("ajaxReadingAnimalrouteTimeout").fatalException("ajax: '/routes/readAnimal' timeout");
      }
    });
  }
}


/**
*
*
* @private
* @author Katharina Poppinga, matr.: 450146
*/
function insertAnimalroute(){

  console.log(animalRoute);

  // ********** AJAX request for posting the animalroute into the database "routeDB" **********
  $.ajax({
    // use a http POST request
    type: "POST",
    // URL to send the request to
    url: "/routes/createAnimal",
    // data to send to the server, send as String for independence of server-side programming language
    data: JSON.stringify(animalRoute),
    // type of the data that is sent to the server
    contentType: "application/json; charset=utf-8",
    // timeout set to 7 seconds
    timeout: 7000
  })

  // if the request is done successfully, ...
  .done (function (response) {

    //
    if (response === "") {
      //
      alert("The animalroute could not be inserted into your database.");
      //
    } else {
      //
      document.getElementById('animalName').innerHTML = "";
      document.getElementById('animalDateTime').innerHTML = "";


      document.getElementById("getAnimalRouteDiv").style.display = "none";

      //
      animalRoutesGroup.clearLayers();
      //
      animalRoute = undefined;
      //

      alert("The animalroute was successfully inserted into your database.");

      getAllRoutes();
    }

    // ... give a notice on the console that the AJAX request for posting the animalroute has succeeded
    console.log("AJAX request (posting animalroute) is done successfully.");
  })

  // if the request has failed, ...
  .fail (function (xhr, status, error) {

    // ... give a notice that the AJAX request for posting the animalroute has failed and show the error on the console
    console.log("AJAX request (posting animalroute) has failed.", error);

    // TODO: ÜBERPRÜFEN, OB SCHREIBWEISE RICHTIG
    // send JSNLog message to the own server-side to tell that this ajax-request has failed because of a timeout
    if (error === "timeout") {
      JL("ajaxCreatingAnimalrouteTimeout").fatalException("ajax: '/routes/createAnimal' timeout");
    }
  });
}
