// jshint esversion: 6
// jshint maxerr: 1000

"use strict";  // JavaScript code is executed in "strict mode"

/**
* @desc final project, Geosoftware1, SoSe2019
* @author name: Katharina Poppinga, matr.: 450 146; name: Paula Scharf, matr.: 450 334
*/

// please put in your own tokens at 'token.js'




// TODO: FOLGENDES IN ONLOAD-FUNKTION SCHREIBEN???


// ****************************** map ******************************

/**
 * create the initial map in the "allRoutesMap"-div, the proper map extract will be set later
 * @type {map}
 */

let encountersMap = L.map('allRoutesMap').setView([0, 0], 3);

/**
 * OpenStreetMap tiles as a layer for the map "allRoutesMap"
 * @type {tileLayer}
 */
let oSMLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});

// add the OpenStreetMap tile layer to the map "allRoutesMap"
oSMLayer.addTo(encountersMap);

/**
 * create a layerGroup for all routes, add this group to the existing map "allRoutesMap"
 * @type {layerGroup}
 */
let routesGroup = L.layerGroup().addTo(encountersMap);


/**
 * create a layerGroup for all encounters, add this group to the existing map "allRoutesMap"
 * @type {layerGroup}
 */
let encountersGroup = L.layerGroup().addTo(encountersMap);


/**
 * This function takes the shared encounter and its corresponding coordinates and shows them in map and tables
 * @private
 * @author Paula Scharf 450334
 */
function processResult() {
    let result = JSON.parse(document.getElementById("result").innerHTML);
    let counter = 0;
    for (let i = 0; i < result.length; i++) {
        let current = result[i];
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
 * @author Paula Scharf 450334
 * @param currentRoute
 * @param counter
 */
function showRoute(currentRoute, counter) {
    if (currentRoute.madeBy === "user") {

        // NEUE/WEITERE ATTRIBUTE NOCH DAZU ....
        // show the i-th route with a consecutive number and its creator, name, date, time and type (.................) in the table "routesTable" on starting page
        createAndWriteTableWithSevenCells(counter, currentRoute.creator, currentRoute.name, currentRoute.date, currentRoute.time, currentRoute.type, "routesTable");
    }

    //
    else if (currentRoute.madeBy === "animal") {

        // NEUE/WEITERE ATTRIBUTE NOCH DAZU ....
        // show the i-th animalroute with a consecutive number and its .......... date, time and ................... in the table "animalRoutesTable" on starting page
        createAndWriteTableWithSevenCells(counter, currentRoute.study_id, currentRoute.individual_taxon_canonical_name, currentRoute.date, currentRoute.time, "und hier?", "animalRoutesTable");
    }


    // ************** show the i-th route in the map "allRoutesMap" on the starting page, therefore do the following steps: **************

    // extract the coordinates of the i-th route
    let coordinatesRoute = swapGeoJSONsLongLatToLatLongOrder_Objects(currentRoute.geoJson.features[0].geometry.coordinates);
    console.log(coordinatesRoute);

    // make a leaflet-polyline from the coordinatesRoute
    let polylineOfRoute = L.polyline(coordinatesRoute, {color: '#ec0000'}, {weight: '3'});

    // add the polyline to the array polylineRoutesLatLongArray for being able to address the polylines(routes) by numbers (kind of IDs) (needed for checkboxes)
    //polylineRoutesLatLongArray.push(polylineOfRoute);

    polylineOfRoute.addTo(routesGroup);
}



/**
 * This function shows an encounter in the map and the table
 * @private
 * @author Paula Scharf 450334
 * @param encounter
 */
function showEncounter(encounter) {
    // fill the table for the encounters with the encounters-array
    fillEncountersTable(encounter);
    // fill the map with all selected encounters
    fillEncountersMap(encounter);
}

/**
 * This function fills the encounters table
 * @private
 * @author Paula Scharf, matr.: 450 334
 * @param currentEncounter - the to be shown encounter
 */
function fillEncountersTable(currentEncounter) {
    createAndWriteTableForASingleEncounter(currentEncounter.intersectionX, currentEncounter.intersectionY, 0, "encountersTable")
    // only show encounters, which are also shown on the map
    // if the encounter is new, then create a new weather request and a new terrain request
    currentEncounter.weather = new WeatherRequest([currentEncounter.intersectionX, currentEncounter.intersectionY], 0);
    if (typeof currentEncounter.terrain === 'undefined') {
        terrainRequest(currentEncounter, 0);
    } else {
        writeRequestResultsIntoTable(currentEncounter.terrain, 0);
    }
}

/**
 * This function fills the map with the given encounter
 * @private
 * @author Paula Scharf, matr.: 450334
 * @param currentEncounter - the to be shown encounter
 */
function fillEncountersMap(currentEncounter) {
    // loop "over" all encounters in the current database "routeDB"
    let color = (currentEncounter.tookPlace === "yes") ? "#60ec07" : "#000bec";

    // make a circle out of the current encounter
    let currentCircle = L.circle([currentEncounter.intersectionX, currentEncounter.intersectionY],
        {radius: 200, color: color, fillColor: color, fillOpacity: 0.5});
    //currentCircle.bindPopup("encounter number " + (i + 1) + " between " + allRoutes[currentEncounter[2].firstRoute][0].creator + " and " + allRoutes[currentEncounter[2].secondRoute][0].creator);
    // add the circle to the array encountersLatLongArray
    //encountersLatLongArray.push(currentCircle);
    currentCircle.addTo(encountersGroup);
    encountersMap.fitBounds(currentCircle.getBounds());
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
        ////JL("testName1").fatal("WETTER API NICHT ERREICHBAR TEST");


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
    writeRequestResultsIntoTable() {
        // show the weather as an icon
        // if you hover over this icon it will show the weather as a text
        if (this.responseText !== "") {
            document.getElementById("weather" + (this.id)).innerHTML = "<span title='" + JSON.parse(this.responseText).weather[0].description + "'><img src=http://openweathermap.org/img/w/" + JSON.parse(this.responseText).weather[0].icon + ".png /img>";
        }
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
            document.getElementById("weather" + (this.id)).innerHTML = "Error: No connection to the server.";


            // KOMMENTAR ANPASSEN
            // log the .... exception to the server and .....
            //JL("weatherRequestError404").fatalException("Error: No connection to the server, Status-Code 404", e);
        }

        //
        else
        {
            document.getElementById("weather" + (this.id)).innerHTML = "Errorcallback: Check web-console.";


            // KOMMENTAR ANPASSEN
            // log the .... exception to the server and .....
            // GENAUER SPEZIFIZIEREN?????
            //JL("weatherRequestError").fatalException("Error: Status-Code " + this.status, e);
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

/**
 * This function makes an XMLHttpRequest to the geonames api to get context information for a specific encounter.
 * @private
 * @author Paula Scharf 450 334
 * @param encounter
 * @param id
 */
function terrainRequest(encounter, id) {
    let lat = encounter.intersectionX;
    let long = encounter.intersectionY;

    //
    let resource = "http://api.geonames.org/findNearbyJSON?lat=" + lat + "&lng=" + long + "&username=" + token.usernameTerrainAPI;

    //
    let xx = new XMLHttpRequest();
    xx.writeRequestResultsIntoTable = writeRequestResultsIntoTable;
    xx.updateEncounter = updateEncounter;
    xx.id = id;
    xx.encounter = encounter;
    xx.onload = function () {
        //console.dir(xx);
        console.log("Geonames: status: " + this.status + " , readyState: " + this.readyState);
    };
    xx.onerror = function (e) {
        //console.dir("xx: " + this.xx);
        console.dir("e: " + e);
        //
        if (this.status === 404)
        {
            document.getElementById("country" + (this.id)).innerHTML = "Error: No connection to the server.";
            document.getElementById("terrain" + (this.id)).innerHTML = "Error: No connection to the server.";


            // KOMMENTAR ANPASSEN
            // log the .... exception to the server and .....
            //JL("terrainRequestError404").fatalException("Error: No connection to the server, Status-Code 404", e);
        }

        //
        else
        {
            document.getElementById("country" + (this.id + 1)).innerHTML = "Errorcallback: Check web-console.";
            document.getElementById("terrain" + (this.id + 1)).innerHTML = "Errorcallback: Check web-console.";


            // KOMMENTAR ANPASSEN
            // log the .... exception to the server and .....
            // GENAUER SPEZIFIZIEREN?????
            //JL("terrainRequestError").fatalException("Error: Status-Code " + this.status, e);
        }
    };
    xx.onreadystatechange = function () {
        if (this.status === 200 && this.readyState === 4)
        {
            let encounter = {
                _id: this.encounter._id,
                terrain: this.responseText
            };
            this.updateEncounter(encounter);
            this.writeRequestResultsIntoTable(this.responseText, this.id);
        }
    };
    xx.open("GET", resource, true);
    xx.send();

}

/**
 * This function writes the request-results of the geonames-xmlhttprequest into the encounters-table.
 * @private
 * @author Paula Scharf 450 334
 * @param response
 * @param id
 */
function writeRequestResultsIntoTable(response, id) {
    // show the terrain .....
    // .....
    if (response !== "") {
        if (typeof JSON.parse(response).geonames !== "undefined" && typeof JSON.parse(response).geonames[0] !== "undefined") {
            document.getElementById("country" + (id)).innerHTML = JSON.parse(response).geonames[0].countryName;
            document.getElementById("terrain" + (id)).innerHTML = JSON.parse(response).geonames[0].fclName;
        } else {
            document.getElementById("country" + (id)).innerHTML = "Country could not be identified.";
            document.getElementById("terrain" + (id)).innerHTML = "Terrain could not be identified.";
        }
    }
}
