// jshint esversion: 6
// jshint maxerr: 1000

"use strict";  // JavaScript code is executed in "strict mode"

/**
* @desc final project, Geosoftware1, SoSe2019
* @author name: Katharina Poppinga, matr.: 450 146; name: Paula Scharf, matr.: 450 334
*/


/**
* Adds a toolbar for drawing polylines to the given leaflet-map and therefore allows to draw a route (just one at a time) in this map.
* In addition, writes the drawn polyline in GeoJSON syntax in the given textarea.
* If the given map is the "updateMap" and the drawn route is deleted, the third and fourth parameter are used, too.
* They restore the old route which was saved before updating.
*
* This function uses leaflet.draw.
* @private
* @author Katharina Poppinga, matr.: 450146
* @param map leaflet-map, in which the polyline shall be drawn (map, in which leaflet.draw shall be integrated)
* @param outputTextarea ID of the textarea in which the new drawn polyline shall be written as a GeoJSON string
* @param polylineOfOldRoute just used, if parameter 'map' has the value "updateMap": old route as a polyline
* @param oldRouteGeoJSON just used, if parameter 'map' has the value "updateMap": old route as a GeoJSON
*/
function drawPolyline(map, outputTextarea, polylineOfOldRoute, oldRouteGeoJSON) {

  // feature group for all drawn items, add this group to the existing map
  let drawnItems = L.featureGroup().addTo(map);

  // add a toolbar for drawing to the existing map
  map.addControl(new L.Control.Draw({

    // customize the drawing options of the toolbar
    draw: {
      // customize the drawing options for polylines (only polylines are possible to draw with this toolbar)
      polyline: {
        // allow the crossing of line segments
        allowIntersection: true,
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
    }
  }));


  // specify a listener: if a new polyline is created, the following function will be executed:
  map.on(L.Draw.Event.CREATED, function (event) {

    // if the current used map is the "updateMap" ...
    if (map._container.id === "updateMap"){
      // ... remove the old route from the "updateMap" for only displaying the new created route in the "updateMap"
      map.removeLayer(polylineOfOldRoute);
    }

    // for having only one polyline in the feature group of drawn polylines, delete the previous polyline
    drawnItems.eachLayer(function (layer){
      drawnItems.removeLayer(layer);
    });

    // add the new drawn polyline (event layer) to the feature group of the drawnItems
    drawnItems.addLayer(event.layer);

    // write the new drawn polyline as a GeoJSON string into the given outputTextarea
    let output = document.getElementById(outputTextarea);
    output.value = JSON.stringify(drawnItems.toGeoJSON(), null, 2);

    // after the polyline is written into the textarea a keyup-event is thrown to trigger the checkForm()-function of the
    // textarea
    let ev = document.createEvent('Event');
    ev.initEvent('keyup', true, false);
    output.dispatchEvent(ev);
  });


  // specify a listener: if the polyline is edited, the following function will be executed:
  map.on(L.Draw.Event.EDITED, function () {

    // write the updated/edited polyline as a GeoJSON string into the given outputTextarea
    let output = document.getElementById(outputTextarea);
    output.value = JSON.stringify(drawnItems.toGeoJSON(), null, 2);

    // after the polyline is written into the textarea a keyup-event is thrown to trigger the checkForm()-function of the
    // textarea
    let ev = document.createEvent('Event');
    ev.initEvent('keyup', true, false);
    output.dispatchEvent(ev);
  });


  // specify a listener: if the polyline is deleted, the following function will be executed:
  map.on(L.Draw.Event.DELETED, function () {

    // if there are no items (polylines) in the feature group of drawnItems (it means that the polyline is really deleted):
    if (drawnItems.getLayers().length === 0){

      // if the current used map is the "updateMap" ...
      if (map._container.id === "updateMap"){

        // ... add the old route to the "updateMap" (recovery, to allow starting a new correction/change of the route in the current update-process)
        map.addLayer(polylineOfOldRoute);

        // ... write the GeoJSON of the old route into the given outputTextarea
        let output = document.getElementById(outputTextarea);
        output.value = JSON.stringify(oldRouteGeoJSON, null, 2);

        // after the polyline is written into the textarea a keyup-event is thrown to trigger the checkForm()-function of the
        // textarea
        let ev = document.createEvent('Event');
        ev.initEvent('keyup', true, false);
        output.dispatchEvent(ev);

        // if the current used map is not the "updateMap" ...
      } else {

        // ... write just nothing into the given outputTextarea
        let output = document.getElementById(outputTextarea);
        output.value = "";

        // after the polyline is written into the textarea a keyup-event is thrown to trigger the checkForm()-function of the
        // textarea
        let ev = document.createEvent('Event');
        ev.initEvent('keyup', true, false);
        output.dispatchEvent(ev);
      }
    }

    // if there is still an item (polyline) in the feature group of drawnItem, do nothing so that the current polyline is still in the given outputTextarea
    // (it is the case if the user has clicked onto "delete layers" and has not selected the polyline to be deleted but nevertheless has then clicked onto "save" that executes this event)
  });
}
