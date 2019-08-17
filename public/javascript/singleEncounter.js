// jshint esversion: 6
// jshint maxerr: 1000

"use strict";  // JavaScript code is executed in "strict mode"

/**
* @desc final project, Geosoftware1, SoSe2019
* @author name: Katharina Poppinga, matr.: 450 146; name: Paula Scharf, matr.: 450 334
*/

// please put in your own tokens at 'token.js'



// TODO: FOLGENDES IN ONLOAD-FUNKTION SCHREIBEN???


// ****************************** global variables *****************************


// TODO: LAYERGROUPS KOMMENTARE ÜBERPRÜFEN

/**
* A Leaflet-map in which the shared encounter is shown.
* @type {Map}
*/
let encountersMap;


/**
* An OpenStreetMap tileLayer.
* @type {tileLayer}
*/
let oSMLayer;


/**
* A leaflet-layerGroup for both routes belonging to the shared encounter.
* @type {layerGroup}
*/
let routesGroup;


/**
* A leaflet-layerGroup for the shared encounter.
* @type {layerGroup}
*/
let encountersGroup;


// *****************************************************************************


// create the initial map in the "singleEncounterMap"-div, the proper map extract will be set later
encountersMap = L.map('singleEncounterMap').setView([0, 0], 3);

// OpenStreetMap tiles as a layer for the map "singleEncounterMap"
oSMLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});

// add the OpenStreetMap tileLayer to the map "singleEncounterMap"
oSMLayer.addTo(encountersMap);

// create a layerGroup for both routes, add this group to the existing map "singleEncounterMap" ......................................
routesGroup = L.layerGroup().addTo(encountersMap);

// create a layerGroup for all encounters, add this group to the existing map "singleEncounterMap" ......................................
encountersGroup = L.layerGroup().addTo(encountersMap);



// ********************************* functions *********************************

/**
* This function takes the shared encounter and its corresponding coordinates and shows them in map and tables.
* @private
* @author Paula Scharf, matr.: 450334
*/
function processResult() {
  // retrieve the result of the databank-read from the hidden element on the page
  let result = JSON.parse(document.getElementById("result").innerHTML);
  let counter = 0;
  // got through the result array containing routes and the encounter
  for (let i = 0; i < result.length; i++) {
    let current = result[i];
    // call the corresponding function for displaying  a route or an encounter
    if (current.what === "route") {
      showRoute(current, counter);
      counter++;
    } else {
      showEncounter(current);
    }
  }
}


/**
* This function shows a route in its corresponding table (animal or user) and in the map.
* @private
* @author Paula Scharf, matr.: 450334
* @param currentRoute
* @param counter
*/
function showRoute(currentRoute, counter) {
  //
  if (currentRoute.madeBy === "user") {

    // show the user route with a consecutive number and its creator, name, date, time and type in the table "routesTable"
    createUserRouteTable(counter, currentRoute.creator, currentRoute.name, currentRoute.date, currentRoute.time, currentRoute.type, "routesTable");
  }

  //
  else if (currentRoute.madeBy === "animal") {

    // show the animal route with a consecutive number and its studyID, individualTaxonCanonicalName, date and time in the table "animalRoutesTable"
    createAnimalRouteTable(counter, currentRoute.study_id, currentRoute.individualTaxonCanonicalName, currentRoute.date, currentRoute.time, "animalRoutesTable");
  }


  // ************** show the route in the map "singleEncounterMap", therefore do the following steps: **************

  // extract the coordinates of the route
  let coordinatesRoute = swapGeoJSONsLongLatToLatLongOrder_Objects(currentRoute.geoJson.features[0].geometry.coordinates);
  // if the current route is a user route, color it red, otherwise orange
  let color = ((currentRoute.madeBy === "user") ? '#ec0000' : '#ec7e00');
  // make a leaflet-polyline from the coordinatesRoute
  let polylineOfRoute = L.polyline(coordinatesRoute, {color: color}, {weight: '3'});

  polylineOfRoute.addTo(routesGroup);
}


/**
* This function shows an encounter in the map and the table.
* @private
* @author Paula Scharf, matr.: 450334
* @param encounter
*/
function showEncounter(encounter) {

  // fill the table for the encounters with the encounters-array
  fillEncountersTable(encounter);
  // fill the map with all selected encounters
  fillEncountersMap(encounter);
}


/**
* This function fills the encounters table.
* @private
* @author Paula Scharf, matr.: 450334
* @param currentEncounter - the to be shown encounter
*/
function fillEncountersTable(currentEncounter) {
  //
  createSingleEncounterTable(currentEncounter.intersectionX, currentEncounter.intersectionY, 0, "encountersTable");
  // only show encounters, which are also shown on the map
  // if the encounter is new, then create a new weather request and a new terrain request
  currentEncounter.weather = new WeatherRequest([currentEncounter.intersectionX, currentEncounter.intersectionY], 0);
  if (typeof currentEncounter.terrain === 'undefined') {
    getNewTerrainRequest(currentEncounter, 0);
  } else {
    writeRequestResultsIntoTable(currentEncounter.terrain, 0);
  }
}


/**
* This function fills the map with the given encounter.
* @private
* @author Paula Scharf, matr.: 450334
* @param currentEncounter - the to be shown encounter
*/
function fillEncountersMap(currentEncounter) {
  // loop "over" all encounters in the current database "routeDB"
  let color = (currentEncounter.tookPlace === "yes") ? "#009d42" : "#000bec";

  // make a circle out of the current encounter
  let currentCircle = L.circle([currentEncounter.intersectionX, currentEncounter.intersectionY],
    {radius: 200, color: color, fillColor: color, fillOpacity: 0.5});

    // TODO: WAS IST MIT DEM AUSKOMMENTIERTEN?

    //currentCircle.bindPopup("encounter number " + (i + 1) + " between " + allRoutes[currentEncounter[2].firstRoute][0].creator + " and " + allRoutes[currentEncounter[2].secondRoute][0].creator);
    // add the circle to the array circleEncounters
    //circleEncounters.push(currentCircle);
    currentCircle.addTo(encountersGroup);
    encountersMap.fitBounds(currentCircle.getBounds());
}
