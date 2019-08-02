// jshint esversion: 6
// jshint maxerr: 1000

"use strict";  // JavaScript code is executed in "strict mode"

/**
* @desc final project, Geosoftware1, SoSe2019
* @author name: Katharina Poppinga, matr.: 450 146; name: Paula Scharf, matr.: 450 334
*/

// please put in your own tokens at 'token.js'



/**
*
*
*
* using leaflet.draw
* @private
* @author Katharina Poppinga
* @param map map, in which the polyline shall be drawn (map, in which leaflet.draw shall be integrated)
* @param outputTextarea ID of the textarea in which the new drawn polyline shall be written as a GeoJSON string
*/
function drawPolyline(map, outputTextarea) {

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

    // FOLGENDES NOCH ANPASSEN
    // customize the editing options of the toolbar
    edit: {
      featureGroup: drawnItems,
    }
  }));


  // specify a listener: if a new polyline is created, the following function will be executed:
  map.on(L.Draw.Event.CREATED, function (event) {

    // for having only one polyline in the feature group of drawn polylines, delete the previous polyline
    drawnItems.eachLayer(function (layer){
      drawnItems.removeLayer(layer);
    });

    // add the new drawn polyline (event layer) to the feature group of the drawnItems
    drawnItems.addLayer(event.layer);

    // write the new drawn polyline as a GeoJSON string into the given outputTextarea
    document.getElementById(outputTextarea).value = JSON.stringify(drawnItems.toGeoJSON());
  });


  // specify a listener: if the polyline is edited, the following function will be executed:
  map.on(L.Draw.Event.EDITED, function (event) {

    // write the updated/edited polyline as a GeoJSON string into the given outputTextarea
    document.getElementById(outputTextarea).value = JSON.stringify(drawnItems.toGeoJSON());
  });


  // specify a listener: if the polyline is deleted, the following function will be executed:
  map.on(L.Draw.Event.DELETED, function (event) {

    // if there are no items (polylines) in the feature group of drawnItems (it means that the polyline is really deleted):
    if (drawnItems.getLayers().length == 0){

      // write just nothing into the given outputTextarea
      document.getElementById(outputTextarea).value = "";
    }

    // if there is still an item (polyline) in the feature group of drawnItem, do nothing so that the current polyline is still in the given outputTextarea
    // (it is the case if the user has clicked onto "delete layers" and has not selected the polyline to be deleted but nevertheless has then clicked onto "save" that executes this event)
  }
);
}
