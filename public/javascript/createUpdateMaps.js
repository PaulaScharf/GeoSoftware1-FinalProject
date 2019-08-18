// jshint esversion: 6
// jshint maxerr: 1000

"use strict";  // JavaScript code is executed in "strict mode"

/**
* @desc final project, Geosoftware1, SoSe2019
* @author name: Katharina Poppinga, matr.: 450 146; name: Paula Scharf, matr.: 450 334
*/


// TODO: JSDOC; KOMMENTARE; ANPASSEN; ONLOAD ETC
/**
*
*
* @private
* @author Katharina Poppinga, matr.: 450146
*/
function submitHandlerCreateForm(){
  $('#createForm').submit(function(e) {

    // prevent form to submit as default
    e.preventDefault();

// Spinner an

    //
    $.ajax({
      // use a http POST request
      type: $(this).attr('method'),
      // URL to send the request to
      url: $(this).attr('action'),
      // type of the data that is sent to the server
      //  contentType: "application/json; charset=utf-8",
      // data to send to the server
      data: $(this).serialize(),
      // timeout set to 10 seconds
      timeout: 10000
    })

    // if the request is done successfully, ...
    .done (function (response) {

      // if the AJAX-request was successful but the inserting itself was not ...
      if (response === "") {
        // ... tell the user about it
        alert("The user route could not be inserted into the database.");

        // after successfully inserted the user route in to the database ...
      } else {
        // ... reset the section for inserting the user route attributes
        document.getElementById("createForm").reset();

        // TODO: route aus map entfernen
        // .remove();

        // TODO: WAS DAMIT?
        // calculate new encounters
        getAllRoutes();

        // ... and tell the user about the success in inserting the user route
        alert("The user route was successfully inserted into the database.");
      }

// Spinner aus

      // ... give a notice on the console that the AJAX request for creating a user route has succeeded
      console.log("AJAX request (creating a user route) is done successfully.");
    })

    // if the request has failed, ...
    .fail(function (xhr, status, error) {

// Spinner aus

      // ... give a notice that the AJAX request for creating a user route has failed and show the error on the console
      console.log("AJAX request (creating a user route) has failed.", error);

      // send JSNLog message to the own server-side to tell that this ajax-request has failed because of a timeout
      if (error === "timeout") {
        JL("ajaxCreatingUserRouteTimeout").fatalException("ajax: '/create' timeout");
      }
    });
  })}


  /**
  * Sets up a leaflet-map with OpenStreetMap tiles and calls a function for enabling the drawing of a polyline into that map.
  * If the given map is the "createMap", also calls another function "getAllRoutes()".
  * If the given map is the "updateMap", shows the route written in the textarea with ID "updateRoute" in the map.
  *
  * @private
  * @author Katharina Poppinga, matr.: 450146
  * @param specificMap ID of a leaflet-map (createMap oder updateMap)
  */
  function showMapData(specificMap) {

    // TODO: ANDERS EINBINDEN, z.B. mit $( document ).ready()
    submitHandlerCreateForm();


    // to have two onload-functions in create.ejs bundled, also call getAllRoutes() when the onload calls the showMapData(createMap)
    if (specificMap === "createMap") {
      getAllRoutes();
    }

    // create the initial map in the map-div
    let map = L.map(specificMap).setView([0, 0], 2);

    // OpenStreetMap tiles as a layer for the map
    let oSMLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });
    // add the OpenStreetMap tile layer to the map
    oSMLayer.addTo(map);

    // if the given map is the "createMap" ...
    if (specificMap === "createMap") {
      // ... enable drawing a route into the map "createMap" (using leaflet.draw) and write the corresponding GeoJSON string into textarea "createRoute"
      drawPolyline(map, "createRoute", "none", "none");
    }


    // if the given map is the "updateMap" ...
    if (specificMap === "updateMap") {

      // ****************** display the old route (the route that shall be updated) in the map "updateMap" ******************

      // get the old route as a GeoJSON-object
      let oldRouteGeoJSON = JSON.parse(document.getElementById("updateRoute").innerHTML);

      // extract the coordinates of the old route
      let coordinatesOldRoute = oldRouteGeoJSON.features[0].geometry.coordinates;

      // outsource the swapping of the order of the coordinates of the old route (GeoJSONs long-lat order to needed lat-long order)
      let coordinatesOldLatLongOrder = swapGeoJSONsLongLatToLatLongOrder_Objects(coordinatesOldRoute);

      // make a leaflet-polyline from the coordinatesOldLatLongOrder
      let polylineOfOldRoute = L.polyline(coordinatesOldLatLongOrder, {color: '#ec0000'}, {weight: '3'});

      // add the polyline-element of the old route to the map "updateMap"
      polylineOfOldRoute.addTo(map);

      // ... set the proper map extract for the old route
      map.fitBounds(polylineOfOldRoute.getBounds());

      // *********************************************************************************************************************

      // enable drawing a route into the map "updateMap" (using leaflet.draw) and write the corresponding GeoJSON string into textarea "updateRoute"
      drawPolyline(map, "updateRoute", polylineOfOldRoute, oldRouteGeoJSON);
    }
  }
