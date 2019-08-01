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

// counter for ID of checkbox
var cb = -1;

// array for the routes which are shown in the map "map"
var routesLatLongArray = [];





// create the initial map in the "map"-HTMLdiv, the proper map extract will be set later
var map = L.map('map').setView([0, 0], 12);

// OpenStreetMap tiles as a layer for the map
var oSMLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});

// add the OpenStreetMap tile layer to the map
oSMLayer.addTo(map);


// create a layer group for all routes, add this group to the existing map
var routesGroup = L.layerGroup().addTo(map);





// FOLGENDES NÖTIG????????????????
// ********************************************************************
// Kommentare anpassen!!!
// ********** the following deleting and resetting is to rebuild the initial conditions (needed if the starting button was already clicked before) **********

// delete all children of the tbodys of all tables for not showing the calculated results several times when clicking the button several times
deleteAllChildrenOfElement("routesTable");



// delete all children of the ordered list of checkboxes for not showing the checkboxes several times when clicking the button several times
//deleteAllChildrenOfElement("routesList");



// reset the counter for table cell IDs
z = 0;

// reset the counter for ID of checkbox
cb = -1;

// delete all existing layers of the layergroup routesGroup for not showing each route several times when clicking the button several times
routesGroup.clearLayers();
// delete all existing elements (routes) in the array routesLatLongArray for not showing each route several times when clicking the button several times
routesLatLongArray.length = 0;

// ********************************************************************




// GEOJSON_VALIDIERUNG EINFÜGEN!!!!!!!!!!!!! (z.B. weiter unten, von geoJSONFeatureCollectionString ??)




// NOCH AUF NEUE NAMEN ANPASSEN

// FOLGENDES AUCH FÜR BEGEGNUNGEN MACHEN

// ********** AJAX request for reading all routes out of the database and writing them into ..?????????????????? **********
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

  console.log(response);

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




// UMÄNDERN; UM IN TB und MAP ZU SCHREIBEN
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

  // UMBENENNEN
  //
  var coordinates;

  // ************************** for HTML-page "index" **************************

  // if there are no routes in the database ...
  if (typeof response[0] === "undefined") {

    /*
    // ... tell the user about it by writing a note into the corresponding textarea "routesTextArea"
    $("#routesTextArea").text("Probably you first have to insert at least one route into the database. For doing this, you can use the menu item 'Route creator'.");
    */

    // if there are routes in the database ... :
  } else {


// FOLGENDES (für i=0) EVTL. IN FOR SCHLEIFE AUFNEHMEN; ausprobieren

    // ROUTEN EINZELN IN TB EINFÜGEN:
    // NEUE/WEITERE ATTRIBUTE NOCH DAZU
    //
    createAndWriteTableWithSevenCells(0, response[0].creator, response[0].name, response[0].date, response[0].time, response[0].type, "routesTable");

    // extract the GeoJSON feature of the first route
    var geoJSONRouteFeaturesString = response[0].routeGeoJSON;



    // EINBLENDEN, WENN NEUE ERSTE ROUTE WG. BEZEICHNUNGSÄNDERUNG
    //    coordinates = response[0].geoJson.features[0].geometry.coordinates;


    let i;
    // loop "over" all routes in the current database "routeDB" except !!!!!!!!!!!!!!!
    for (i = 1; i < response.length; i++) {



      // ROUTEN EINZELN IN TB EINFÜGEN:
      // NEUE/WEITERE ATTRIBUTE NOCH DAZU
      //
      createAndWriteTableWithSevenCells(i, response[i].creator, response[i].name, response[i].date, response[i].time, response[i].type, "routesTable");

      coordinates = response[i].geoJson.features[0].geometry.coordinates;

      console.log(response[i].geoJson.features[0].geometry.coordinates);


      // LÖSCHEN, WENN FERTIG
      /*
      // ROUTEN ALS FEATURECOLLECTION IN MAP EINFÜGEN:
      // concatenate all features and separate them with a comma
      geoJSONRouteFeaturesString = geoJSONRouteFeaturesString + "," + response[i].routeGeoJSON;
      console.log(geoJSONRouteFeaturesString);
      */



      // LÖSCHEN, WENN FERTIG
      /*
      // make a feature collection with all features of geoJSONRouteFeaturesString
      let geoJSONFeatureCollectionString = '{"type":"FeatureCollection","features":[' + geoJSONRouteFeaturesString + ']}';
      // write this feature collection into map "map"
      // ???????????????????
      /*
      $("#routesTextArea").val(geoJSONFeatureCollectionString);
      */
      /*
      // AUS geoJSONFeatureCollectionString die variable route MACHEN !!!!!
      var route = geoJSONRouteFeaturesString;
      var routeParsed = JSON.parse(route);
      console.log(routeParsed);
      var routeOh;

      let j;
      // loop "over" all routes in the current database "routeDB"
      for (j = 0; j < response.length; j++) {

      routeOh = routeParsed.features[0].geometry.coordinates[j];
      */






      // IN EIGENE FUNKTION AUSLAGERN:

      // *************** adding the part route to the routesGroup and therefore to the map ***************

      // outsource the swapping of the coordinates' order of the currentOriginalRoute (GeoJSONs long-lat order to needed lat-long order for displaying the route in map)
      var partRouteLatLongOrder = swapGeoJSONLongLatToLatLongOrder(coordinates);

      // make a leaflet-polyline from the currentOriginalRouteLatLongOrder
      let currentPolyline = L.polyline(partRouteLatLongOrder, {color: '#ec0000'}, {weight: '3'});

      // add the current polyline to the array routesLatLongArray for being able to address the polylines/routes by numbers (kind of IDs)
      routesLatLongArray.push(currentPolyline);


      let l;
      // loop "over" all poylines/routes in routesLatLongArray
      for (l = 0; l < routesLatLongArray.length; l++){

        // add the l-th polyline-element of the array routesLatLongArray to the routesGroup that is shown in the map
        routesLatLongArray[l].addTo(routesGroup);
      }
      // *************************************************************************************************


    }
  }



  // LÖSCHEN, WENN FERTIG:
  // to test the syntax, because only String-concatenations are made
  // console.log(JSON.parse(geoJSONFeatureCollectionString));


}











// FOLGENDES AN AKTUELLE AUFGABE ANPASSEN!!!!!!!!!!!!!!!!!!!!!


// function heißt "calculateAndWritePartDistance(...)" in Üb7
// KOMMENTARE ANPASSEN!!
/**
* Calculates the distance of given part route and writes it into HTMLtable.
* For additional information, for every part route, the current weather and some (max. 5) suggestions for nearby natural recreation areas (if the weather is good)
* or shops (if the weather is bad) are requested from OpenWeatherMap-API and the HERE-Places-API and written in the corresponding HTMLtables.
* In addition, the generated part routes are added to the existing map. Besides, in this map the locations of the natural recreation areas or shops are shown as markers.
* These markers bind popups which show the current weather and the name of the suggested places.
* For every part route a checkbox is created, that allows the user to select or deselect the part route. Selected routes are shown in the map, deselected are not.
*
* @private
* @author Katharina Poppinga
* @param {number} numberOriginalRoute - number of corresponding original route
* @param partRoute - part route for which the distance has to be calculated
* @return {number} distancePartRoute - calculated distance of given part route
*/
function writeRoutes(numberOriginalRoute, partRoute){

  // during the first call of this function, set proper the map extract:
  if (cb === 0) {
    // center the map on the first point of the (first, because cb === 0) route
    map.setView([partRoute[0][1], partRoute[0][0]], 12);
  }


  /*
  // write calculated distance of part route into HTMLtable and adding two extra cells to the table for the additional information which is written into them later
  createAndWriteTableWithSevenCells(numberOriginalRoute, "hm", "DistancesRoutesOutsidePolygon");
  */



  // outsource the creation of the checkbox belonging to the given part route
  checkbox(cb);


  // *************** adding the part route to the routesGroup and therefore to the map ***************

  // outsource the swapping of the coordinates' order of the currentOriginalRoute (GeoJSONs long-lat order to needed lat-long order for displaying the route in map)
  var partRouteLatLongOrder = swapGeoJSONLongLatToLatLongOrder(partRoute);

  // make a leaflet-polyline from the currentOriginalRouteLatLongOrder
  let currentPolyline = L.polyline(partRouteLatLongOrder, {color: '#ec0000'}, {weight: '3'});

  // add the current polyline to the array routesLatLongArray for being able to address the polylines/routes by numbers (kind of IDs)
  routesLatLongArray.push(currentPolyline);


  let l;
  // loop "over" all poylines/routes in routesLatLongArray
  for (l = 0; l < routesLatLongArray.length; l++){

    // add the l-th polyline-element of the array routesLatLongArray to the routesGroup that is shown in the map
    routesLatLongArray[l].addTo(routesGroup);
  }
  // *************************************************************************************************

  // calculated distance of the part route
  return distancePartRoute;
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
