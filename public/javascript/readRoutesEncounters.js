// jshint esversion: 6
// jshint maxerr: 1000

"use strict";  // JavaScript code is executed in "strict mode"

/**
 * @desc final project, Geosoftware1, SoSe2019
 * @author name: Katharina Poppinga, matr.: 450 146; name: Paula Scharf, matr.: 450 334
 */

// please put in your own tokens at 'token.js'


// TODO: DIESE DATEI AM ENDE IN INDEX.JS ÜBERFÜHREN


// TODO: KOMMENTARE (u.a. IN CHECKBOX-FUNKTIONEN) an consecutive nr mit 1 beginnend ANPASSEN
// TODO: ALLE NUMMERN AN CONSECUTIVE NUMBER MIT 1 BEGINNEND ANPASSEN


// ALLROUTESMAP UMBENENNEN IN AUCH BEGEGNUNGEN


// FÜR TESTZWECKE, SPÄTER HIER LÖSCHEN
JL("testName1").fatal("Teeeest JSNLog");


// TODO: muss in allen JS-dateien stehen, die JSNLoggen
var appender = JL.createAjaxAppender("Appender");
appender.setOptions({
    "maxBatchSize": 100
});

JL().setOptions({
    "appenders": [appender]
});



// ****************************** global variables ******************************

// TODO: WARUM LET UND VAR GEMISCHT??
// TODO: I wanted to talk about that too. Personally I prefer let (https://stackoverflow.com/questions/762011/whats-the-difference-between-using-let-and-var).

/**
 * global variable, which contains
 * [all routes from the db,
 * boolean indicating if route is currently displayed]
 * @type {Array} allRoutes
 */
let allRoutes = [];
/**
 * global variable, which contains
 * [all encounters from the db,
 * boolean indicating if encounter is currently displayed,
 * object containing the indexes of the corresponding routes in the allRoutes-array]
 * @type {Array} allEncounters
 */
let allEncounters = [];

// TODO: I think its not a good idea to make the counter a global variable
/**
 * counter for table cell IDs
 * @type {number} z
 */
let z = 0;

// TODO: refactor names
/**
 * array for the routes which are shown in the map "allRoutesMap"
 * @type {Array} polylineRoutesLatLongArray
 */
let polylineRoutesLatLongArray = [];
/**
 * array for the encounters which are shown in the map "allRoutesMap"
 * @type {Array} encountersLatLongArray
 */
let encountersLatLongArray = [];




// TODO: FOLGENDES IN ONLOAD-FUNKTION SCHREIBEN???

// ****************************** map ******************************

/**
 * create the initial map in the "allRoutesMap"-div, the proper map extract will be set later
 * @param {map} allRoutesMap
 */
let allRoutesMap = L.map('allRoutesMap').setView([0, 0], 3);

/**
 * OpenStreetMap tiles as a layer for the map "allRoutesMap"
 * @param {tileLayer} oSMLayer
 */
let oSMLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});

// add the OpenStreetMap tile layer to the map "allRoutesMap"
oSMLayer.addTo(allRoutesMap);

/**
 * create a layerGroup for all routes, add this group to the existing map "allRoutesMap"
 * @param {layerGroup} routesGroup
 */
let routesGroup = L.layerGroup().addTo(allRoutesMap);


/**
 * create a layerGroup for all encounters, add this group to the existing map "allRoutesMap"
 * @param {layerGroup} encountersGroup
 */
let encountersGroup = L.layerGroup().addTo(allRoutesMap);

/*
// create a layer group for all markers, add this group to the existing map "..."
var markersGroup = L.layerGroup().addTo(map....);
*/
// *****************************************************************



// TODO: GEOJSON-VALIDIERUNG EINFÜGEN!!!!!!!!! (z.B. weiter unten, bei .....)
// für create-route und update-route



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
    dataType: "json",

    // NÖTIG????
    // timeout set to 5 seconds
    timeout: 5000
})

// if the request is done successfully, ...
    .done (function (response) {

        // ... give a notice on the console that the AJAX request for reading all routes has succeeded
        console.log("AJAX request (reading all routes) is done successfully.");

        //
        writeAllRoutesInTheGlobalArray(response);

        // ... show all read routes on starting page (in table and in map), as the following function does:
        showAllRoutesOnStartingPage(allRoutes);

        //
        getAllEncountersAndShow();
    })

    // if the request has failed, ...
    .fail (function (xhr, status, error) {
        // ... give a notice that the AJAX request for reading all routes has failed and show the error-message on the console
        console.log("AJAX request (reading all routes) has failed.", error.message);
    });


// *****************************************************************


/**
 * This function retrieves all encounters from the database and displays them on the map and the table.
 * Also if a route is deleted, added or updated the encounters in the database are also adjusted with this function.
 * @author name: Paula Scharf, matr.: 450 334
 */
function getAllEncountersAndShow() {
    //
    $.ajax({
        // use a http GET request
        type: "GET",
        // URL to send the request to
        url: "/encounter/getAll",
        // data type of the response
        dataType: "json",

        // NÖTIG????
        // timeout set to 5 seconds
        timeout: 5000
    })

    // if the request is done successfully, ...
        .done (function (response) {

            // TODO: FOLGENDES IN SEPARATE FUNKTION AUSLAGERN, ANSTATT DIREKT IM AJAX?  ***********************************
            //
            for (let i = 0; i < response.length; i++) {
                let currentEncounter = response[i];
                console.log(currentEncounter);
                //
                let noOfRoutes = {firstRoute: undefined, secondRoute: undefined};
                // go through all routes, to determine their index in the allRoutes-array and give that information
                // to the encounter
                for (let k = 0; k < allRoutes.length; k++) {
                    if (allRoutes[k][0]._id == currentEncounter.firstRoute) {
                        noOfRoutes.firstRoute = k;
                    }
                    //
                    else if (allRoutes[k][0]._id == currentEncounter.secondRoute) {
                        noOfRoutes.secondRoute = k;
                    }
                }
                //
                if (typeof noOfRoutes.firstRoute === "undefined" || typeof noOfRoutes.secondRoute === "undefined") {
                    // delete the current encounter from the db if any of the corresponding routes are missing
                    deleteEncounter(currentEncounter._id);
                    //
                } else {
                    // give true as the second argument to indicate that all corresponding routes for this encounter are selected
                    // give true as the fourth argument to indicate that ther is either no search active or this encounter is
                    // currently being searched for
                    allEncounters.push([currentEncounter, true, noOfRoutes, "no search"])
                }
            }
            // ************************************************************************************************************


            // check if a route was added or updated and adjust the encounters accordingly
            checkForNewRoute(allRoutes, true);

            //console.log(allEncounters);

            showEncountersOnStartingPage();

            // ... give a notice on the console that the AJAX request for reading all encounters has succeeded
            console.log("AJAX request (reading all encounters) is done successfully.");
        })

        // if the request has failed, ...
        .fail (function (xhr, status, error) {
            // ... give a notice that the AJAX request for reading all routes has failed and show the error-message on the console
            console.log("AJAX request (reading all encounters) has failed.", error.message);
        });
}



/**
 *
 *
 *
 */
function writeAllRoutesInTheGlobalArray(response) {
    for (let i = 0; i < response.length; i++) {
        allRoutes.push([response[i], true]);
        allRoutes[i][0].geoJson.features[0].geometry.coordinates = swapGeoJSONsLongLatToLatLongOrder(allRoutes[i][0].geoJson.features[0].geometry.coordinates);
    }
}



// TODO: refactor all for-loops, so that they use "current..."
// TODO: numbers of routes and encounters should start with 1
// JSDOC ANPASSEN!!!
/**
 * Takes the response of the AJAX GET-request for reading all routes out of the database.
 * ........ Writes routes into table and shows routes in map (both on starting page) ............
 *
 *
 * @private
 * @author Katharina Poppinga
 */
function showAllRoutesOnStartingPage() {

    // coordinates of a route (in GeoJSONs long-lat order)
    var coordinatesRoute;

    // loop "over" all routes in the current database "routeDB"
    for (let i = 0; i < allRoutes.length; i++) {
        let currentRoute = allRoutes[i];

        // NEUE/WEITERE ATTRIBUTE NOCH DAZU ....
        // show the i-th route with a consecutive number and its creator, name, date, time and type (.................) in the table "routesTable" on starting page
        createAndWriteTableWithSevenCells(i + 1, currentRoute[0].creator, currentRoute[0].name, currentRoute[0].date, currentRoute[0].time, currentRoute[0].type, "routesTable");


        // ************** show the i-th route in the map "allRoutesMap" on the starting page, therefore do the following steps: **************

        // outsource the creation of the checkbox for showing or not showing the i-th route in the map
        checkbox(i);

        // extract the coordinates of the i-th route
        coordinatesRoute = currentRoute[0].geoJson.features[0].geometry.coordinates;
        console.log(coordinatesRoute);
        // for the first route of the database ...
        if (i === 0) {
            // ... center the map on the first point of the first route
            allRoutesMap.setView([coordinatesRoute[i].lat, coordinatesRoute[i].lng], 2);
        }

        // make a leaflet-polyline from the coordinatesLatLongOrder
        let polylineOfRoute = L.polyline(coordinatesRoute, {color: '#ec0000'}, {weight: '3'});

        // add the polyline to the array polylineRoutesLatLongArray for being able to address the polylines(routes) by numbers (kind of IDs) (needed for checkboxes)
        polylineRoutesLatLongArray.push(polylineOfRoute);

        if (currentRoute[1]) {
            // add the i-th polyline-element of the array polylineRoutesLatLongArray to the routesGroup and therefore to the map "allRoutesMap"
            polylineRoutesLatLongArray[i].addTo(routesGroup);
        }
    }
}



// JSDOC ANPASSEN!!!
/**
 * This function displays all encounters in the map and in the table after they have been retrieved from the database.
 * @private
 * @author name: Paula Scharf, matr.: 450 334
 */
function showEncountersOnStartingPage() {
    // fill the table for the encounters with the encounters-array
    fillEncountersTable();
    encountersGroup.eachLayer(function (layer)
    {
        encountersGroup.removeLayer(layer);
    });
    encountersLatLongArray = [];
    // loop "over" all encounters in the current database "routeDB"
    for (let i = 0; i < allEncounters.length; i++) {
        let currentEncounter = allEncounters[i];
        // make a circle out of the current encounter
        let currentCircle = L.circle([currentEncounter[0].intersectionX, currentEncounter[0].intersectionY], {radius: 200}, {color: '#000bec'});
        currentCircle.bindPopup("encounter between route number " + currentEncounter[2].firstRoute + "and route number " + currentEncounter[2].secondRoute);
        // add the circle to the array encountersLatLongArray
        encountersLatLongArray.push(currentCircle);
        if(currentEncounter[1] && (currentEncounter[3] == "no search" || currentEncounter[3] == "searched for")) {
            // add the encountersLatLongArray to the encountersGroup
            encountersLatLongArray[i].addTo(encountersGroup);
        }
    }
}



/**
 *  fill the encounters table
 * @private
 * @author Paula Scharf, matr.: 450 334
 */
function fillEncountersTable() {
    // clear the table
    deleteAllChildrenOfElement("encountersTable");
    // fill the table
    for (let i = 0; i < allEncounters.length; i++) {
        let currentEncounter = allEncounters[i];
        // only show encounters, which are also shown on the map
        if (currentEncounter[1] && (currentEncounter[3] === "no search" || currentEncounter[3] === "searched for")) {
            createAndWriteTableWithThreeCells(i + 1, currentEncounter[2].firstRoute + 1, currentEncounter[2].secondRoute + 1, i, "encountersTable");
            // if the encounter is new, then create a new weather request and a new terrain request
            if (typeof currentEncounter[0].weather === 'undefined') {
                currentEncounter[0].weather = new WeatherRequest([currentEncounter[0].intersectionX, currentEncounter[0].intersectionX], i);
                currentEncounter[0].terrain = new TerrainRequest([currentEncounter[0].intersectionX, currentEncounter[0].intersectionX], i);

                // if the encounter is old, reuse the response of the already existing corresponding weather and terrain requests
            } else {
                currentEncounter[0].weather.x.writeRequestResultsIntoTable();
                currentEncounter[0].terrain.xx.writeRequestResultsIntoTable();
            }
            shareButton(i);
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

// add a checkbox (which calls the function routeSelectionForMap(cb_id) if clicked) to the content of the "tableCellCheckbox"
tableCellCheckbox.innerHTML = tableCellCheckbox.innerHTML + " <input type='checkbox' id='checkbox" +cb_id+ "' checked=true onclick='routeSelectionForMap("+cb_id+")'>";
}

function shareButton(bt_id) {
// label the table cell, in which the checkbox will be written, as "tableCellCheckbox"
    let tableCellButton = document.getElementById("conseNumEnc"+bt_id);

    let ids = {
        e_id : allEncounters[bt_id][0]._id,
        r1_id: allRoutes[allEncounters[bt_id][2].firstRoute][0]._id,
        r2_id: allRoutes[allEncounters[bt_id][2].secondRoute][0]._id,
    };
    console.log(ids.e_id);

    // add a button (which calls the function routeSelectionForMap(bt_id) if clicked) to the content of the "tableCellCheckbox"
    tableCellButton.innerHTML = "<form action='/encounter/getSingleEncounter?e_id=" + ids.e_id+ "' method='GET' name='shareForm'>" +
        "<input type='submit' value='share' id='sharebutton" + bt_id + "'/></form>";
}

function getSingleEncounterPage(encounterIndex) {

    $.ajax({
        // use a http POST request
        type: "GET",
        // URL to send the request to
        url: "/encounter/getSingleEncounter",
        //
        data: ids,

        // NÖTIG????
        // timeout set to 5 seconds
        timeout: 5000
    })

    // if the request is done successfully, ...
        .done (function (response) {
            // ... give a notice on the console that the AJAX request for ....... has succeeded
            console.log("AJAX request (redirecting to the single-encounter-page) is done successfully.");
        })

        // if the request has failed, ...
        .fail(function (xhr, status, error) {
            // ... give a notice that the AJAX request for .......... has failed and show the error-message on the console
            console.log("AJAX request (updating a route GENAUER SPEZIFIZIEREN/TRENNEN?) has failed.", error.message);


            // TODO:
            // WIE NUR FÜR TIMEOUT MACHEN ??? BRINGT HIER SONST NICHTS
            // WAS BEI ANDEREN ERRORS?
            // NOTFALLS LÖSCHEN, BEI ALLEN AJAX
            JL("ajaxEncounterUpdateTimeout").fatal("ajax: '/encounter/update' timeout");

        });
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
    let checkBox = document.getElementById("checkbox" + cb_id);

    // if the checkbox is picked ...
    if (checkBox.checked === true){
        // ... show the corresponding route in the map "allRoutesMap" (by adding this route to the layerGroup "routesGroup")
        routesGroup.addLayer(polylineRoutesLatLongArray[cb_id]);
        // set to true to indicate, that the route is currently selected
        allRoutes[cb_id][1] = true;
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
        routesGroup.removeLayer(polylineRoutesLatLongArray[cb_id]);
        // set to false to indicate, that the route is currently not selected
        allRoutes[cb_id][1] = false;
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

    console.log("calculate encounters to be removed");

    let result = [];

    for (let i = 0; i < allEncounters.length; i++) {
        let currentEncounter = allEncounters[i];
        // all encounters which belong to the deselected route have to be removed
        if(currentEncounter[3] !== "searched for" && (currentEncounter[2].firstRoute === routeId || currentEncounter[2].secondRoute === routeId)) {
            result.push(i);
        }
    }

    console.log(result);
    return result;
}



/**
 * This function returns all ids of encounters which have to be added, because a route was reselected.
 * @private
 * @author Paula Scharf
 * @param routeId           id of affected route
 * @returns {Array} result  ids of affected encounters
 */
function encountersToBeAdded(routeId) {

    let result = [];
    //
    for (let i = 0; i < allEncounters.length; i++) {
        // only routes which belong to the selected route and one other selected route have to be added
        if (allEncounters[i][2].firstRoute === routeId && allRoutes[allEncounters[i][2].secondRoute][1]) {
            result.push(i);
        }
        else if (allEncounters[i][2].secondRoute === routeId && allRoutes[allEncounters[i][2].firstRoute][1]) {
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

/**
 *
 * @param obj - the checkbox-object for the search
 */
function searchEncounters(obj) {
    // if the checkbox is checked then do the search
    if($(obj).is(":checked")){
        let name = document.getElementById("searchRouteName").value;
        let routeIds = searchForRouteIds(name);
        console.log(routeIds);
        for (let i = 0; i < allRoutes.length; i ++) {
            routesGroup.removeLayer(polylineRoutesLatLongArray[i]);
            if (routeIds.includes(i)) {
                polylineRoutesLatLongArray[i].setStyle({
                    color: '#ecd43f'
                });
                routesGroup.addLayer(polylineRoutesLatLongArray[i]);
                document.getElementById("checkbox" + i).checked = true;
                allRoutes[i][1] = true;
            } else {
                document.getElementById("checkbox" + i).checked = false;
                allRoutes[i][1] = false;
            }
        }
        for (let i = 0; i < allEncounters.length; i++) {
            let currentEncounter = allEncounters[i];
            if (routeIds.includes(currentEncounter[2].firstRoute) || routeIds.includes(currentEncounter[2].secondRoute)) {
                allEncounters[i][1] = true;
                allEncounters[i][3] = "searched for";
            } else {
                console.log(false);
                allEncounters[i][1] = false;
                allEncounters[i][3] = "not searched for";
            }
        }
        showEncountersOnStartingPage();
        // if the checkbox is unchecked then undo the search
    }else{
        encountersGroup.eachLayer(function (layer)
        {
            encountersGroup.removeLayer(layer);
        });
        for (let i = 0; i < polylineRoutesLatLongArray.length; i++) {
            polylineRoutesLatLongArray[i].setStyle({
                color: 'red'
            });
        }
        for (let i = 0; i < allEncounters.length; i++) {
            let currentEncounter = allEncounters[i];
            allEncounters[i][3] = "no search";
            if (allRoutes[currentEncounter[2].firstRoute][1] && allRoutes[currentEncounter[2].secondRoute][1]) {
                allEncounters[i][1] = true;
            } else {
                allEncounters[i][1] = false;
            }
        }
        showEncountersOnStartingPage();
    }

}

function searchForRouteIds(input) {
    let result = [];
    for (let i = 0; i < allRoutes.length; i++) {
        let currentRoute = allRoutes[i];
        if(currentRoute[1] && currentRoute[0].name === input) {
            result.push(i);
        }
    }
    return result;
}


/**
 * @desc This class creates and holds a request to openweathermap.
 * @author Paula Scharf 450334
 */
class WeatherRequest
{
    /**
     * @desc This is the constructor of the class WeatherRequest.
     * @param intersection
     * @param id     ?????????????????????????
     */
    constructor(intersection, id)
    {
        var lat = intersection[0];
        var long = intersection[1];

        //
        this.resource = "https://api.openweathermap.org/data/2.5/weather?lat=" + lat + "&lon=" + long + "&appid=" + token.OPENWEATHERMAP_TOKEN;


        // TESTZWECKE, SPÄTER LÖSCHEN
        //console.log("WETTER API NICHT ERREICHBAR TEST");
        //JL("testName1").fatal("WETTER API NICHT ERREICHBAR TEST");


        //
        this.x = new XMLHttpRequest();
        this.x.intersection = intersection;
        this.x.id = id;
        this.x.writeRequestResultsIntoTable = this.writeRequestResultsIntoTable;
        this.x.onload = this.loadcallback;
        this.x.onerror = this.errorcallback;
        this.x.onreadystatechange = this.statechangecallback;
        this.openAndSendRequest();

    }

    //
    openAndSendRequest()
    {
        this.x.open("GET", this.resource, true);
        this.x.send();
    }

    /**
     * @desc This function is called, when there is a change in the XMLHttpRequest "x".
     * If it is called and the status is 200 and readyState is 4, it writes the weather into the table and creates an infoRequest.
     */
    statechangecallback()
    {
        if (this.status === 200 && this.readyState === 4)
        {
            this.writeRequestResultsIntoTable();
        }
    }

    /**
     * @desc This function writes the weather into the associated cell in the table.
     */
    writeRequestResultsIntoTable()
    {
        // show the weather as an icon
        // if you hover over this icon it will show the weather as a text
        document.getElementById("weather" + (this.id + 1)).innerHTML =  "<span title='" + JSON.parse(this.responseText).weather[0].description + "'><img src=http://openweathermap.org/img/w/" + JSON.parse(this.responseText).weather[0].icon + ".png /img>";
    }

    /**
     * @desc This function is called when there is an error with the request.
     */
    errorcallback(e) {
        //console.dir("x: " + this.x);
        console.dir("e: " + e);
        //
        if (this.status === 404)
        {
            document.getElementById("weatherOriginal" + this.indiRoute.positionI + "split" + this.indiRoute.positionJ).innerHTML = "error: no connection to the server";


            // KOMMENTAR ANPASSEN
            // log the .... exception to the server and .....
            JL("weatherRequestError404").fatalException("Error: No connection to the server, Status-Code 404", e);
        }

        //
        else
        {
            document.getElementById("weatherOriginal" + this.indiRoute.positionI + "split" + this.indiRoute.positionJ).innerHTML = "errorcallback: check web-console";


            // KOMMENTAR ANPASSEN
            // log the .... exception to the server and .....
            // GENAUER SPEZIFIZIEREN?????
            JL("weatherRequestError").fatalException("Error: Status-Code " + this.status, e);
        }
    }

    /**
     * @desc This funcion is called when the request is loaded for the first time.
     */
    loadcallback() {
        //console.dir(x);
        console.log("OpenWeatherMap: status: " + this.status + " , readyState: " + this.readyState);
    }
}




// terrain API


// http://api.geonames.org/findNearbyJSON?lat=50.356345&lng=9.563345&username=geosoftw_k_p


/**
 * @desc This class creates and holds a request to API geonames.. (GENAUER NAME)..........
 * @author Paula Scharf 450334
 */
class TerrainRequest
{
    /**
     * @desc This is the constructor of the class TerrainRequest.
     * @param indiRoute an object of the class individualRoute
     */

    constructor(intersection, id)
    {
        var lat = intersection[0];
        var long = intersection[1];

        //
        this.resource = "http://api.geonames.org/findNearbyJSON?lat=" + lat + "&lng=" + long + "&username=" + token.usernameTerrainAPI;

        //
        this.xx = new XMLHttpRequest();
        this.xx.intersection = intersection;
        this.xx.id = id;
        this.xx.writeRequestResultsIntoTable = this.writeRequestResultsIntoTable;
        this.xx.onload = this.loadcallback;
        this.xx.onerror = this.errorcallback;
        this.xx.onreadystatechange = this.statechangecallback;
        this.openAndSendRequest();

    }

    //
    openAndSendRequest()
    {
        this.xx.open("GET", this.resource, true);
        this.xx.send();
    }

    /**
     * @desc This function is called, when there is a change in the XMLHttpRequest "xx".
     * If it is called and the status is 200 and readyState is 4, it writes the weather into the table and creates an infoRequest.
     */

    statechangecallback()
    {
        if (this.status === 200 && this.readyState === 4)
        {
            this.writeRequestResultsIntoTable();
        }
    }

    /**
     * @desc This function writes the weather into the associated cell in the table.
     */

    writeRequestResultsIntoTable()
    {
        // show the terrain .....
        // .....
        document.getElementById("country" + (this.id + 1)).innerHTML = JSON.parse(this.responseText).geonames[0].countryName;
        document.getElementById("terrain" + (this.id + 1)).innerHTML = JSON.parse(this.responseText).geonames[0].fclName;
    }

    /**
     * @desc This function is called when there is an error with the request.
     */

    errorcallback(e) {
        //console.dir("xx: " + this.xx);
        console.dir("e: " + e);
        //
        if (this.status === 404)
        {
            document.getElementById("weatherOriginal" + this.indiRoute.positionI + "split" + this.indiRoute.positionJ).innerHTML = "error: no connection to the server";


            // KOMMENTAR ANPASSEN
            // log the .... exception to the server and .....
            JL("terrainRequestError404").fatalException("Error: No connection to the server, Status-Code 404", e);
        }

        //
        else
        {
            document.getElementById("weatherOriginal" + this.indiRoute.positionI + "split" + this.indiRoute.positionJ).innerHTML = "errorcallback: check web-console";


            // KOMMENTAR ANPASSEN
            // log the .... exception to the server and .....
            // GENAUER SPEZIFIZIEREN?????
            JL("terrainRequestError").fatalException("Error: Status-Code " + this.status, e);
        }
    }

    /**
     * @desc This funcion is called when the request is loaded for the first time.
     */

    loadcallback() {
        //console.dir(xx);
        console.log("Geonames: status: " + this.status + " , readyState: " + this.readyState);
    }
}
