// jshint esversion: 6
// jshint maxerr: 1000

"use strict";  // JavaScript code is executed in "strict mode"

/**
* @desc final project, Geosoftware1, SoSe2019
* @author name: Katharina Poppinga, matr.: 450 146; name: Paula Scharf, matr.: 450 334
*/

// please put in your own tokens at 'token.js'


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
// create a layer group for all markers, add this group to the existing map
var markersGroup = L.layerGroup().addTo(map);



// *********************************** leaflet.draw (in this task only for POLYGONs) ***********************************

// feature group for all drawn items, add this group to the existing map
var drawnItems = L.featureGroup().addTo(map);


// add a toolbar for drawing to the existing map
map.addControl(new L.Control.Draw({

  // customize the drawing options of the toolbar
  draw: {
    // customize the drawing options for polylines (only polylines are possible to draw with this toolbar)
    polyline: {
      // allow the crossing of line segments
      allowIntersection: true,

      // HIER NOCH ANPASSEN ?
    },
    // the following types must not be drawn
    circle: false,
    circlemarker: false,
    marker: false,
    polygon: false,
    rectangle: false
  },

  // customize the editing options of the toolbar
  edit: {
    featureGroup: drawnItems,


    /*poly: {
    // forbid the crossing of line segments, because it is only one polygon wanted, not several
    allowIntersection: false
  }*/


}
}));



// specify a listener: if a new polyline is created, the following function will be executed:
map.on(L.Draw.Event.CREATED, function (event) {


  // beliebig viele polylines auf einmal einzeichenbar????????
  /*
  // for having only one polygon in the feature group of drawn polygons, delete the previous polygon
  drawnItems.eachLayer(function (layer){
  drawnItems.removeLayer(layer);
});
*/


// FOLGENDES AUF MEHRERE POLYLINES ANPASSEN ******************************************************************************************

// add the new drawn polygon (event layer) to the feature group of the drawnItems
drawnItems.addLayer(event.layer);

// write the new drawn polyline as a GeoJSON string into the HTMLtextarea "polygonTextArea" (for using this as a new input polygon for the route calculations)
document.getElementById("route").value = JSON.stringify(drawnItems.toGeoJSON());
});



// specify a listener: if the polyline is edited, the following function will be executed:
map.on(L.Draw.Event.EDITED, function (event) {

  // write the updated/edited polygon as a GeoJSON string into the HTMLtextarea "polygonTextArea" (for using this as a new input polygon for the route calculations)
  document.getElementById("route").value = JSON.stringify(drawnItems.toGeoJSON());
});



// LÖSCHEN FUNKTIONIERT NOCH NICHT FÜR MEHR ALS 1 POLYLINE

// specify a listener: if the polyline is deleted, the following function will be executed:
map.on(L.Draw.Event.DELETED, function (event) {

  // if there are no items (polylines) in the feature group of drawnItems (it means that the polyline is really deleted):
  if (drawnItems.getLayers().length == 0){

    // write just nothing into the HTMLtextarea "polygonTextArea"
    document.getElementById("route").value = "";
  }

  // if there is still an item (polygon) in the feature group of drawnItem, do nothing so that the current polygon is still in the HTMLtextarea "polygonTextArea"
  // (it is the case if the user has clicked onto "delete layers" and has not selected the polygon to be deleted but nevertheless has then clicked onto "save" that executes this event)
}
);

// ***********************************************************************************************************************************
