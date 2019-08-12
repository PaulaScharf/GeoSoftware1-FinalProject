// ****************************** map ******************************

/**
 * create the initial map in the "allRoutesMap"-div, the proper map extract will be set later
 * @param {map} allRoutesMap
 */
let encountersMap = L.map('allRoutesMap').setView([0, 0], 3);

/**
 * OpenStreetMap tiles as a layer for the map "allRoutesMap"
 * @param {tileLayer} oSMLayer
 */
let oSMLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});

// add the OpenStreetMap tile layer to the map "allRoutesMap"
oSMLayer.addTo(encountersMap);

/**
 * create a layerGroup for all routes, add this group to the existing map "allRoutesMap"
 * @param {layerGroup} routesGroup
 */
let routesGroup = L.layerGroup().addTo(encountersMap);


/**
 * create a layerGroup for all encounters, add this group to the existing map "allRoutesMap"
 * @param {layerGroup} encountersGroup
 */
let encountersGroup = L.layerGroup().addTo(encountersMap);

/*
// create a layer group for all markers, add this group to the existing map "..."
let markersGroup = L.layerGroup().addTo(map....);
*/
// *****************************************************************


function processResult() {
    let result = JSON.parse(document.getElementById("result").innerHTML);
    for (let i = 0; i < result.length; i++) {
        let current = result[i];
        if (current.what === "route") {
            showRoute(current);
        } else {
            showEncounter(current);
        }
    }
}

function showRoute(currentRoute) {
    // NEUE/WEITERE ATTRIBUTE NOCH DAZU ....
    // show the i-th route with a consecutive number and its creator, name, date, time and type (.................) in the table "routesTable" on starting page
    createAndWriteTableWithSevenCells(1, currentRoute.creator, currentRoute.name, currentRoute.date, currentRoute.time, currentRoute.type, "routesTable");


    // ************** show the i-th route in the map "allRoutesMap" on the starting page, therefore do the following steps: **************

    // extract the coordinates of the i-th route
    let coordinatesRoute = swapGeoJSONsLongLatToLatLongOrder(currentRoute.geoJson.features[0].geometry.coordinates);
    console.log(coordinatesRoute);

    // make a leaflet-polyline from the coordinatesLatLongOrder
    let polylineOfRoute = L.polyline(coordinatesRoute, {color: '#ec0000'}, {weight: '3'});

    // add the polyline to the array polylineRoutesLatLongArray for being able to address the polylines(routes) by numbers (kind of IDs) (needed for checkboxes)
    //polylineRoutesLatLongArray.push(polylineOfRoute);

    polylineOfRoute.addTo(routesGroup);

}

function showEncounter(encounter) {
    // fill the table for the encounters with the encounters-array
    fillEncountersTable(encounter);
    // fill the map with all selected encounters
    fillEncountersMap(encounter);
}

/**
 *  fill the encounters table
 * @private
 * @author Paula Scharf, matr.: 450 334
 */
function fillEncountersTable(currentEncounter) {
    // only show encounters, which are also shown on the map
    // if the encounter is new, then create a new weather request and a new terrain request
    currentEncounter.weather = new WeatherRequest([currentEncounter.intersectionX, currentEncounter.intersectionY], 0);
    if (typeof currentEncounter.terrain === 'undefined') {
        terrainRequest(currentEncounter, 0);
    } else {
        writeRequestResultsIntoTable(currentEncounter.terrain, 0);
    }
}

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
    encountersMap.setView([currentEncounter.intersectionX, currentEncounter.intersectionY], 9);


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
            document.getElementById("weather" + (this.id)).innerHTML = "error: no connection to the server";


            // KOMMENTAR ANPASSEN
            // log the .... exception to the server and .....
            //JL("weatherRequestError404").fatalException("Error: No connection to the server, Status-Code 404", e);
        }

        //
        else
        {
            document.getElementById("weather" + (this.id)).innerHTML = "errorcallback: check web-console";


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
            document.getElementById("country" + (this.id)).innerHTML = "error: no connection to the server";
            document.getElementById("terrain" + (this.id)).innerHTML = "error: no connection to the server";


            // KOMMENTAR ANPASSEN
            // log the .... exception to the server and .....
            //JL("terrainRequestError404").fatalException("Error: No connection to the server, Status-Code 404", e);
        }

        //
        else
        {
            document.getElementById("country" + (this.id + 1)).innerHTML = "errorcallback: check web-console";
            document.getElementById("terrain" + (this.id + 1)).innerHTML = "errorcallback: check web-console";


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

function writeRequestResultsIntoTable(response, id) {
    // show the terrain .....
    // .....
    if (response !== "") {
        if (typeof JSON.parse(response).geonames !== "undefined" && typeof JSON.parse(response).geonames[0] !== "undefined") {
            document.getElementById("country" + (id)).innerHTML = JSON.parse(response).geonames[0].countryName;
            document.getElementById("terrain" + (id)).innerHTML = JSON.parse(response).geonames[0].fclName;
        } else {
            document.getElementById("country" + (id)).innerHTML = "country could not be identified";
            document.getElementById("terrain" + (id)).innerHTML = "terrain could not be identified";
        }
    }
}
