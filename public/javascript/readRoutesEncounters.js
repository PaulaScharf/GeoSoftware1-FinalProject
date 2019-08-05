// jshint esversion: 6
// jshint maxerr: 1000

"use strict";  // JavaScript code is executed in "strict mode"

/**
 * @desc final project, Geosoftware1, SoSe2019
 * @author name: Katharina Poppinga, matr.: 450 146; name: Paula Scharf, matr.: 450 334
 */

// please put in your own tokens at 'token.js'


// DIESE DATEI VERMUTLICH IN INDEX.JS ÜBERFÜHREN


// CONSECUTIVE NUMBER BEGINNT MIT 0 !! FALLS ÄNDERUNG ZU 1, DANN KOMMENTARE IN CHECKBOX-FUNKTIONEN ANPASSEN

// ALLROUTESMAP UMBENENNEN IN AUCH BEGEGNUNGEN


// ****************************** global variables ******************************

// counter for table cell IDs
var z = 0;

// TODO: refactor names
// array for the routes which are shown in the map "allRoutesMap"
var polylineRoutesLatLongArray = [];

// array for the encounters which are shown in the map "allRoutesMap"
var encountersLatLongArray = [];


// ****************************** map ******************************

// create the initial map in the "allRoutesMap"-div, the proper map extract will be set later
var allRoutesMap = L.map('allRoutesMap').setView([0, 0], 2);

// OpenStreetMap tiles as a layer for the map "allRoutesMap"
var oSMLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});

// add the OpenStreetMap tile layer to the map "allRoutesMap"
oSMLayer.addTo(allRoutesMap);

// create a layerGroup for all routes, add this group to the existing map "allRoutesMap"
var routesGroup = L.layerGroup().addTo(allRoutesMap);

// create a layerGroup for all encounters, add this group to the existing map "allRoutesMap"
var encountersGroup = L.layerGroup().addTo(allRoutesMap);

/*
// create a layer group for all markers, add this group to the existing map "..."
var markersGroup = L.layerGroup().addTo(map....);
*/
// *****************************************************************



// GEOJSON-VALIDIERUNG EINFÜGEN!!!!!!!!! (z.B. weiter unten, bei .....)



// FOLGENDES AUCH FÜR BEGEGNUNGEN MACHEN?
// *****************************************************************
// ********** AJAX request for reading all routes (NUR ROUTES ODER AUCH BEGEGNUNGEN???) out of the database
// and writing them into ......(ANPASSEN AN BEIDE FUNKTIONSAUFRUFE!!!!!) **********
$.ajax({
    // use a http GET request
    type: "GET",
    // URL to send the request to
    url: "/displayAll",
    // data type of the response
    dataType: "json"
})

// if the request is done successfully, ...
    .done (function (response) {

        console.log("ajax-GET-response:", response);

        // ... show all read routes on starting page (in table and in map), as the following function does:
        showAllRoutesOnStartingPage(response);
        // ... ?
        calculateEncountersForAllRoutes(response);

        showEncountersOnStartingPage(allEncounters);



        // ... give a notice on the console that the AJAX request for reading all routes has succeeded
        console.log("AJAX request (reading all routes) is done successfully.");
    })

    // if the request has failed, ...
    .fail (function (xhr, status, error) {
        // ... give a notice that the AJAX request for reading all routes has failed and show the error-message on the console
        console.log("AJAX request (reading all routes) has failed.", error.message);
    });

// *****************************************************************



// JSDOC ANPASSEN!!!
/**
 * Takes the response of the AJAX GET-request for reading all routes out of the database.
 * ........ Writes routes into table and shows routes in map (both on starting page) ............
 *
 *
 * @private
 * @author Katharina Poppinga
 * @param response response of AJAX GET-request for reading all routes out of the database
 */
function showAllRoutesOnStartingPage(response) {
    console.log("show Routes");

    // coordinates of a route (in GeoJSONs long-lat order)
    var coordinatesRoute;

    // folgendes if LÖSCHEN ?????????
    // if there are no routes in the database ...
    if (typeof response[0] === "undefined") {
        // if there are routes in the database ... :
    } else {

        // loop "over" all routes in the current database "routeDB"
        for (let i = 0; i < response.length; i++) {


            // NEUE/WEITERE ATTRIBUTE NOCH DAZU ....
            // show the i-th route with a consecutive number and its creator, name, date, time and type (.................) in the table "routesTable" on starting page
            createAndWriteTableWithSevenCells(i, response[i].creator, response[i].name, response[i].date, response[i].time, response[i].type, "routesTable");



            // ************** show the i-th route in the map "allRoutesMap" on the starting page, therefore do the following steps: **************

            // outsource the creation of the checkbox for showing or not showing the i-th route in the map
            checkbox(i);

            // extract the coordinates of the i-th route
            coordinatesRoute = swapGeoJSONsLongLatToLatLongOrder(response[i].geoJson.features[0].geometry.coordinates);
            console.log(coordinatesRoute);
            // for the first route of the database ...
            if (i === 0) {
                // ... center the map on the first point of the first route
                allRoutesMap.setView([coordinatesRoute[i].lat, coordinatesRoute[i].lng], 2);
            }

            // make a leaflet-polyline from the coordinatesLatLongOrder
            let polylineOfRoute = L.polyline(coordinatesRoute, {color: '#ec0000'}, {weight: '3'});

            // add the polyline to the array polylineRoutesLatLongArray for being able to address the polylines(routes) by numbers (kind of IDs) (needed for checkboxes)
            polylineRoutesLatLongArray.push([polylineOfRoute, true]);

            // add the i-th polyline-element of the array polylineRoutesLatLongArray to the routesGroup and therefore to the map "allRoutesMap"
            polylineRoutesLatLongArray[i][0].addTo(routesGroup);
        }
    }
}



// JSDOC ANPASSEN!!!
/**
 * Takes the response of the AJAX GET-request for ............
 *
 *
 * @private
 * @author Paula Scharf
 * @param encounters
 * @param response response of AJAX GET-request for reading all .... out of the database
 */
function showEncountersOnStartingPage(encounters) {
    // fill the table for the encounters with the encounters-array
    fillEncountersTable(encounters);
    // loop "over" all encounters in the current database "routeDB"
    for (let i = 0; i < encounters.length; i++) {
        // ************** show the i-th encounter in the map "allRoutesMap" on the starting page, therefore do the following steps: **************

// VERGLEICHEN MIT ROUTEN IN OBIGER FUNKTION

        // make a leaflet-polyline from the currentOriginalRouteLatLongOrder
        let currentPoint = L.circle(encounters[i][0].intersection, {radius: 200}, {color: '#000bec'});

        // add the current .......... to the array encountersLatLongArray for being able to address the .......... by numbers (kind of IDs)
        encountersLatLongArray.push(currentPoint);

        encountersLatLongArray[i].addTo(encountersGroup);
    }
}

/**
 *  fill the encounters table
 * @private
 * @author Paula Scharf
 * @param encounters - array of encounters
 */
function fillEncountersTable(encounters) {
    // clear the table
    deleteAllChildrenOfElement("encountersTable");
    // fill the table
    for (let i = 0; i < encounters.length; i++) {
        // only show encounters, which are also shown on the map
        if (encounters[i][1] == true) {
            createAndWriteTableWithThreeCells(i, encounters[i][0].firstRoute, encounters[i][0].secondRoute, "encountersTable");
            // if the encounter is new then create a new weather request
            if (typeof encounters[i][0].weatherRequest === 'undefined') {
                encounters[i][0].weatherRequest = new WeatherRequest(encounters[i][0].intersection, i);
            // if the encounter is old reuse the response of the already existing corresponding weather request
            } else {
                encounters[i][0].weatherRequest.x.writeRequestResultsIntoTable();
            }
        }
    }
}


/**
 * Creates a checkbox - inside the fixed corresponding table cell - that corresponds to the individual route, which has the same consecutive
 * number as the id of the checkbox.
 * A selected/checked checkbox adds its corresponding route to the "routesGroup", therefore this route is shown in the map "allRoutesMap".
 * A deselected checkbox removes its corresponding route from the "routesGroup", therefore this route is not shown in the map "allRoutesMap".
 *
 * @private
 * @author Katharina Poppinga
 * @param {number} cb_id - ID for the checkbox to be created
 */
function checkbox(cb_id){
    // label the table cell, in which the checkbox will be written, as "tableCellCheckbox"
    let tableCellCheckbox = document.getElementById("conseNum"+z);

    // add a checkbox (which calls the function routeSelectionForMap(cb_id) if clicked) to the content of the "tableCellCheckbox"
    tableCellCheckbox.innerHTML = tableCellCheckbox.innerHTML + " " + "<input type='checkbox' id='" +cb_id+ "' checked=true onclick='routeSelectionForMap("+cb_id+")'>";
}



/**
 * Checks whether a checkbox with given ID is checked (picked) or not (deselected) for customizing the shown routes in the map "allRoutesMap".
 * If the checkbox is checked (picked), the corresponding route (route with the same consecutive number or the same "element-number" in the
 * polylineRoutesLatLongArray (global variable) as the ID of the checkbox) is added to the routesGroup (global variable) and therefore shown in the map "allRoutesMap".
 *
 * @private
 * @author Katharina Poppinga, Paula Scharf
 * @param {number} cb_id - ID of the checkbox
 * @param {array} idsOfEncounters - IDs of the corresponding encounters
 */
function routeSelectionForMap(cb_id){
    console.log(routesGroup);
    // label the checkbox
    let checkBox = document.getElementById(cb_id);

    // if the checkbox is picked ...
    if (checkBox.checked === true){
        // ... show the corresponding route in the map "allRoutesMap" (by adding this route to the layerGroup "routesGroup")
        routesGroup.addLayer(polylineRoutesLatLongArray[cb_id][0]);
        // set to true to indicate, that the route is currently selected
        polylineRoutesLatLongArray[cb_id][1] = true;
        // get all ids of encounters which have to be added
        let idsOfEncountersToBeAdded = encountersToBeAdded(cb_id);
        // add the encounters
        for (let i = 0; i < idsOfEncountersToBeAdded.length; i++) {
            encountersGroup.addLayer(encountersLatLongArray[idsOfEncountersToBeAdded[i]]);
            // set to true to indicate, that the route is currently selected
            allEncounters[idsOfEncountersToBeAdded[i]][1] = true;
        }
        // refill the encounters-table, so that it only shows selected encounters
        fillEncountersTable(allEncounters);
    }

    // if the checkbox is deselected ...
    else {
        // ... do not show the corresponding route in the map "allRoutesMap" (by removing this route from the layerGroup "routesGroup")
        routesGroup.removeLayer(polylineRoutesLatLongArray[cb_id][0]);
        // set to false to indicate, that the route is currently not selected
        polylineRoutesLatLongArray[cb_id][1] = false;
        // get all ids of encounters which have to be removed
        let idsOfEncountersToBeRemoved = encountersToBeRemoved(cb_id);
        // remove the encounters
        for (let i = 0; i < idsOfEncountersToBeRemoved.length; i++) {
            encountersGroup.removeLayer(encountersLatLongArray[idsOfEncountersToBeRemoved[i]]);
            // set to false to indicate, that the encounter is currently not selected
            allEncounters[idsOfEncountersToBeRemoved[i]][1] = false;
        }
        // refill the encounters-table, so that it only shows selected encounters
        fillEncountersTable(allEncounters);
    }
}

/**
 * This function returns all ids of encounters which have to be removed, because a route was deselected
 * @private
 * @author Paula Scharf
 * @param routeId           id of affected route
 * @returns {Array} result  ids of affected encounters
 */
function encountersToBeRemoved(routeId) {
    console.log("calculate encounters to be removed")
    let result = [];
    for (let i = 0; i < allEncounters.length; i++) {
        // all encounters which belong to the deselected route have to be removed
        if(allEncounters[i][0].firstRoute == routeId || allEncounters[i][0].secondRoute == routeId) {
            result.push(i);
        }
    }
    return result;
}

/**
 * This function returns all ids of encounters which have to be added, because a route was reselected
 * @private
 * @author Paula Scharf
 * @param routeId           id of affected route
 * @returns {Array} result  ids of affected encounters
 */
function encountersToBeAdded(routeId) {
    let result = [];
    for (let i = 0; i < allEncounters.length; i++) {
        // only routes which belong to the selected route and one other selected route have to be added
        if(allEncounters[i][0].firstRoute == routeId && polylineRoutesLatLongArray[allEncounters[i][0].secondRoute][1] == true) {
            result.push(i);
        }
        else if(allEncounters[i][0].secondRoute == routeId && polylineRoutesLatLongArray[allEncounters[i][0].firstRoute][1] == true) {
            result.push(i);
        }
    }
    return result;
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
