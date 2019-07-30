// jshint esversion: 6
// jshint maxerr: 1000

"use strict";  // JavaScript code is executed in "strict mode"

/**
* @desc final project, Geosoftware1, SoSe2019
* @author name: Katharina Poppinga, matr.: 450 146; name: Paula Scharf, matr.: 450 334
*/

// please put in your own tokens at 'token.js'


// counter for table cell IDs
var z = 0;



// create the initial map in the "map"-HTMLdiv, the proper map extract will be set later
var map = L.map('map').setView([0, 0], 12);

// OpenStreetMap tiles as a layer for the map
var oSMLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});

// add the OpenStreetMap tile layer to the map
oSMLayer.addTo(map);




// NOCH AUF NEUE NAMEN ANPASSEN

// FOLGENDES AUCH FÜR BEGEGNUNGEN MACHEN

// ********** AJAX request for reading all routes out of the database and writing them into ..?????????????????? **********
$.ajax({
  // use a http GET request
  type: "GET",
  // URL to send the request to
  url: "/api/readRoutes",
  // data type of the response
  dataType: "json"
})

// if the request is done successfully, ...
.done (function (response) {

  // ... show all read routes on index.html, as the following function does:
  showRoutesOnIndexHTML(response);

  // ... give a notice on the console that the AJAX request for reading all routes has succeeded
  console.log("AJAX request (reading all routes) is done successfully.");
})

// if the request has failed, ...
.fail (function (xhr, status, error) {
  // ... give a notice that the AJAX request for reading all routes has failed and show the error-message on the console
  console.log("AJAX request (reading all routes) has failed.", error.message);
});




// UMÄNDERN; UM IN TB ZU SCHREIBEN
/**
* Takes the response of the AJAX GET-request for reading all routes out of the database. Accesses the GeoJSON feature
* of each route and brings these together to a GeoJSON feature collection. Writes this feature collection
* into the HTML-textarea "routesTextArea" in "index.html".
*
* @private
* @author Katharina Poppinga
* @param response response of AJAX GET-request for reading all routes out of the database
*/
function showRoutesOnIndexHTML(response) {

  // ************************** for HTML-page "index" **************************

  // if there are no routes in the database ...
  if (typeof response[0] === "undefined") {

    // ... tell the user about it by writing a note into the corresponding textarea "routesTextArea"
    $("#routesTextArea").text("Probably you first have to insert at least one route into the database. For doing this, you can use the menu item 'Route creator'.");

    // if there are routes in to database ... :
  } else {
    // extract the GeoJSON feature of the first route
    var geoJSONRouteFeaturesString = response[0].routeGeoJSON;

    let i;
    // loop "over" all routes in the current database "routeDB" except the first
    for (i = 1; i < response.length; i++) {


// IN MAP EINFÜGEN !!!!!!!
response[i].routeGeoJSON




// "" entfernen, wenn richtige Attributebezeichnungen klar sind
//
createAndWriteTableWithSevenCells(i, "response[i].username", "response[i].date", "response[i].time", "response[i].type", "routesTable");



/*

      // concatenate all features and separate them with a comma
      geoJSONRouteFeaturesString = geoJSONRouteFeaturesString + "," + response[i].routeGeoJSON;
    }

    // make a feature collection with all features of geoJSONRouteFeaturesString
    let geoJSONFeatureCollectionString = '{"type":"FeatureCollection","features":[' + geoJSONRouteFeaturesString + ']}';

    // write this feature collection into corresponding textarea "routesTextArea"
    $("#routesTextArea").val(geoJSONFeatureCollectionString);

    // to test the syntax, because only String-concatenations are made
    // console.log(JSON.parse(geoJSONFeatureCollectionString));
    */
  }
}
}












/**
* Takes a route with its coordinates as long-lat-pairs and swaps these so that a new route with its coordinates as lat-long-pairs is returned.
* The route has to be valid GeoJSON.
*
* @author Katharina Poppinga
* @param route - route, written in valid GeoJSON, with long-lat coordinate pairs
* @return routeLatLongOrder - a new array containing the route with swapped lat-long coordinate pairs
*/
function swapGeoJSONLongLatToLatLongOrder(route){

  // point with lat,long-order of its coordinate
  let latLong;
  // route with its points in lat,long-coordinate-order
  var routeLatLongOrder = [];

  let c;
  // loop "over" all points in given route
  for (c = 0; c < route.length; c++){

    // swap current long,lat coordinate to lat,long coordinate
    latLong = L.GeoJSON.coordsToLatLng(route[c]);

    // write new built lat,long-coordinate-pair (as an object) into the array routeLatLongOrder, for getting the given route with swapped coordinates
    routeLatLongOrder.push(latLong);
  }

  // return the given route with swapped coordinates
  return routeLatLongOrder;
}










/**
* Creates a checkbox inside the HTML-ordered list (with id routesList) that selects or deselects the corresponding individual part route.
* A selected route is shown in the map, a deselected is not.
*
* @private
* @author Katharina Poppinga
* @param {number} cb_id - ID for the checkbox to be created
*/
function checkbox(cb_id){

  // save the ordered list with id "routesList" from HTMLdocument in variable routesList
  let routesList = document.getElementById("routesList");

  // create an HTML-list-element (indended for the ordered list) and save it as listedRoute
  let listedRoute = document.createElement("li");

  // create a checkbox (which calls the function routeSelectionForMap(cb_id) when clicked) as the content of the HTML-list-element
  listedRoute.innerHTML = "Route <input type='checkbox' id='" +cb_id+ "' checked=true onclick='routeSelectionForMap("+cb_id+")'>";

  // append this HTML-list-element to the ordered list
  routesList.appendChild(listedRoute);
}



/**
* Checks whether a checkbox with given ID is checked (picked) or not (deselected) for customizing the shown routes in the map.
* If the checkbox is checked (picked), the corresponding route (route with the same "element-number" in the routesLatLongArray (global variable)
* as the ID of the checkbox) is added to the routesGroup (global variable) and therefore shown in the map.
*
* @private
* @author Katharina Poppinga
* @param {number} cb_id - ID of the checkbox
*/
function routeSelectionForMap(cb_id){

  // checkbox corresponding to route
  let checkBox = document.getElementById(cb_id);

  // if the checkbox is picked ...
  if (checkBox.checked === true){
    // ... show the corresponding route in the map (by adding this route to the layer-group routesGroup)
    routesGroup.addLayer(routesLatLongArray[cb_id]);
  }

  // if the checkbox is deselected ...
  else {
    // do not show the corresponding route in the map (by removing this route from the layer-group routesGroup)
    routesGroup.removeLayer(routesLatLongArray[cb_id]);
  }
}
