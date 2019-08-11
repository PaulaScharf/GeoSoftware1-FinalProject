// jshint esversion: 8
// jshint maxerr: 1000

"use strict";  // JavaScript code is executed in "strict mode"


/**
* @desc final project, Geosoftware1, SoSe2019
* @author name: Katharina Poppinga, matr.: 450 146; name: Paula Scharf, matr.: 450 334
*/



// TODO: INHALT SPÄTER IN ANDERE BESTEHENDE, PASSENDE (für create.ejs und singleRoute.ejs) JS-DATEI EINFÜGEN,
// DANN DIESE DATEI LÖSCHEN


// TODO:
// bei update der route: (bei create alles ok)
// TypeError: document.getElementById(idInputTextarea).value; is null, kommt erst nach dem updaten, wenn /item/single aufgerufen wird



/**
* Takes the ID of the textarea which contains the route input and checks whether this route input is in a correct GeoJSON syntax.
* If its syntax is correct, the corresponding action form will be submitted. If its syntax is incorrect, the
* corresponding action form will not be submitted and the user is given a notice.
*
* @private
* @author Katharina Poppinga
* @param idInputTextarea ID of the textarea which contains the route input
* @return {boolean} true, if the route input is in a correct GeoJSON syntax, false if not
*/
function validateGeoJSON(idInputTextarea) {

  // take the content of textarea with the id idInputTextarea
  let routeInput = document.getElementById(idInputTextarea ).value;

  console.log(routeInput);

  // check whether createRouteInput is valid JSON that can be parsed, if not throw an exception and do not submit form
  try {
    JSON.parse(routeInput);
  }
  catch (exception){
    alert("The route input has no valid JSON syntax and cannot be parsed.\n" + exception);
    // do not submit form
    return false;
  }

  // if there is no exception thrown, parse the already saved content routeInput into object routeJSONInput
  let routeJSONInput = JSON.parse(routeInput);

  // check whether the syntax of the input route is conform to GeoJSON syntax:
  // attribute "properties" is not checked because it is not that relevant for this assignment

  // check whether all necessary attributes exist
  if ((routeJSONInput.type !== "undefined") && (routeJSONInput.features !== "undefined") &&


   (Array.isArray(routeJSONInput.features)) &&


  (routeJSONInput.features[0].type !== "undefined") && (routeJSONInput.features[0].geometry !== "undefined") &&


  (routeJSONInput.features[0].geometry.type !== "undefined") && (routeJSONInput.features[0].geometry.coordinates!== "undefined") &&


  (Array.isArray(routeJSONInput.features[0].geometry.coordinates))) {

    //
    if ((routeJSONInput.type === "FeatureCollection") && (routeJSONInput.features.length === 1)) {

      // check the following in the only item in the array 'routeJSONInput.features':
      if ((routeJSONInput.features[0].type === "Feature") && (routeJSONInput.features[0].geometry.type === "LineString") &&
      (routeJSONInput.features[0].geometry.coordinates.length >= 2 )) {

        // loop "over" all elements in the array 'routeJSONInput.features[i].geometry.coordinates[0]', (over all coordinate-pairs at its best)
        for (let j = 0; j < routeJSONInput.features[0].geometry.coordinates.length; j++) {

          // check whether the j-th element in the array 'routeJSONInput.features[i].geometry.coordinates[0]' is an array with length 2
          if ((Array.isArray(routeJSONInput.features[0].geometry.coordinates[j])) && (routeJSONInput.features[0].geometry.coordinates[j].length === 2)) {

            // check whether both elements in routeJSONInput.features[i].geometry.coordinates[0][j] are numbers
            if ((typeof routeJSONInput.features[0].geometry.coordinates[j][0] === "number") && (typeof routeJSONInput.features[0].geometry.coordinates[j][1] === "number")) {

              // correct GeoJSON syntax of the input route
              console.log("Route syntax checked: GeoJSON syntax is correct.");
              return true;

              // if the input route is not written in a correct GeoJSON syntax:
            } else {
              // tell the user that the input is incorrect
              alert("The route input is not in the requested correct GeoJSON syntax (FeatureCollection with a LineString feature)!\nThe coordinates have to be numbers.");
              return false;
            }
          } else {
            // tell the user that the input is incorrect
            alert("The textarea for the route input only accepts the requested GeoJSON FeatureCollection in a correct GeoJSON syntax.");
            return false;
          }
        }
      } else {
        // tell the user that the input is incorrect
        alert("The textarea for the route input only accepts the requested GeoJSON FeatureCollection in a correct GeoJSON syntax.");
        return false;
      }
    } else {
      // tell the user that the input is incorrect
      alert("The textarea for the route input only accepts the requested GeoJSON FeatureCollection in a correct GeoJSON syntax.");
      return false;
    }
  } else {
    // tell the user that the input is incorrect
    alert("The textarea for the route input only accepts the requested GeoJSON FeatureCollection in a correct GeoJSON syntax.");
    return false;
  }
}
