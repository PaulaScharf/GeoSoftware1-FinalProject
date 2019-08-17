// jshint esversion: 8
// jshint maxerr: 1000

"use strict";  // JavaScript code is executed in "strict mode"


/**
* @desc final project, Geosoftware1, SoSe2019
* @author name: Katharina Poppinga, matr.: 450 146; name: Paula Scharf, matr.: 450 334
*/


/**
* Takes the ID of the textarea which contains the route and checks whether this route is in a correct JSON and a correct GeoJSON syntax.
* If its syntax is correct, true is returned. If its syntax is incorrect, the user is given a notice and false is returned.
*
* @author Katharina Poppinga, matr.: 450146
* @param idInputTextarea ID of the textarea which contains the route input
* @return {boolean} true, if the route input is in a correct GeoJSON syntax, false if not
*/
function validateJSONAndGeoJSON(idInputTextarea) {

  // take the content of textarea with the id idInputTextarea
  let routeInput = document.getElementById(idInputTextarea ).value;

  // needed for checked JSON-syntax of route
  let routeJSONInput;

  // check whether routeInput is valid JSON that can be parsed ...
  try {
    // ... if so, parse routeInput into object routeJSONInput
    routeJSONInput = JSON.parse(routeInput);
  }
  // if createRouteInput is not valid JSON and can not be parsed, throw an exception ...
  catch (exception){
    // ... and tell the user and return false
    alert("The route input has no valid JSON syntax and cannot be parsed.\n" + exception);
    return false;
  }

  // return true, if routeJSONInput is written in valid GeoJSON, return false, if not
  return (validateGeoJSON(routeJSONInput));
}


/**
* Takes a route in correct JSON syntax and checks whether this route is in correct GeoJSON syntax.
* If its syntax is correct GeoJSON, true is returned. If not, the user is given a notice and
* false is returned.
*
* @private
* @author Katharina Poppinga, matr.: 450146
* @param routeJSON the route (in JSON syntax) to check for a correct GeoJSON syntax
* @return {boolean} true, if the route is in correct GeoJSON syntax, false if not
*/
function validateGeoJSON(routeJSON) {

  // check whether the syntax of the input route is conform to the GeoJSON syntax:
  // (attribute "properties" is not checked because it is not that relevant for this project)

  // check whether all necessary attributes exist and have their required values:
  if ((routeJSON.hasOwnProperty("type")) && (routeJSON.hasOwnProperty("features")) &&
  (Array.isArray(routeJSON.features)) &&
  (routeJSON.features[0].hasOwnProperty("type")) && (routeJSON.features[0].hasOwnProperty("geometry")) &&
  (routeJSON.features[0].geometry.hasOwnProperty("type")) && (routeJSON.features[0].geometry.hasOwnProperty("coordinates")) &&
  (Array.isArray(routeJSON.features[0].geometry.coordinates))) {
    if ((routeJSON.type === "FeatureCollection") && (routeJSON.features.length === 1)) {

      // check the following in the only item in the array 'routeJSONInput.features':
      if ((routeJSON.features[0].type === "Feature") && (routeJSON.features[0].geometry.type === "LineString") &&
      (routeJSON.features[0].geometry.coordinates.length >= 2 )) {

        // loop "over" all elements in the array 'routeJSONInput.features[i].geometry.coordinates[0]', (over all coordinate-pairs at its best)
        for (let j = 0; j < routeJSON.features[0].geometry.coordinates.length; j++) {

          // check whether the j-th element in the array 'routeJSONInput.features[i].geometry.coordinates[0]' is an array with length 2
          if ((Array.isArray(routeJSON.features[0].geometry.coordinates[j])) && (routeJSON.features[0].geometry.coordinates[j].length === 2)) {

            // check whether both elements in routeJSONInput.features[i].geometry.coordinates[0][j] are numbers
            if ((typeof routeJSON.features[0].geometry.coordinates[j][0] === "number") && (typeof routeJSON.features[0].geometry.coordinates[j][1] === "number")) {

              // if the input route is not written in a correct GeoJSON syntax, tell the user about it and return false:
            } else {
              alert("The route input is not in the requested correct GeoJSON syntax (FeatureCollection with a LineString feature)!\nThe coordinates have to be numbers.");
              return false;
            }
          } else {
            alert("The textarea for the route input only accepts the requested GeoJSON FeatureCollection in a correct GeoJSON syntax.");
            return false;
          }
        }

        // correct GeoJSON syntax of the input route
        console.log("Route syntax checked: correct GeoJSON syntax.");
        return true;

      } else {
        alert("The textarea for the route input only accepts the requested GeoJSON FeatureCollection in a correct GeoJSON syntax.");
        return false;
      }
    } else {
      alert("The textarea for the route input only accepts the requested GeoJSON FeatureCollection in a correct GeoJSON syntax.");
      return false;
    }
  } else {
    alert("The textarea for the route input only accepts the requested GeoJSON FeatureCollection in a correct GeoJSON syntax.");
    return false;
  }
}
