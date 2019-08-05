// jshint esversion: 6
// jshint maxerr: 1000

"use strict";  // JavaScript code is executed in "strict mode"

/**
* @desc final project, Geosoftware1, SoSe2019
* @author name: Katharina Poppinga, matr.: 450 146; name: Paula Scharf, matr.: 450 334
*/

// please put in your own tokens at 'token.js'


//
var alreadyKnownRoutes = [];

//
var allEncounters = [];


/**
* this function calculates the encounters for all routes in the database
* @param response  the response of the ajax-request in readRoutesEncounters.js
* @author name: Paula Scharf, matr.: 450 334
*/
function calculateEncountersForAllRoutes(response) {
  // go through all routes in the response
  for (let i = 0; i < response.length; i++) {
    // swap the coordinates for each route
    response[i].geoJson.features[0].geometry.coordinates = swapGeoJSONsLongLatToLatLongOrder(response[i].geoJson.features[0].geometry.coordinates);
    calculateEncounters(response[i].geoJson.features[0].geometry.coordinates, i);
    // push the finished route to this array, to compare it with the following routes of the response
    alreadyKnownRoutes.push(response[i]);
  }
}


/**
* This function calculates all encounters of a given route with all other routes.
* @param oneRoute  a route (only the coordinates)
* @param oneId     id of oneRoute
* @author name: Paula Scharf, matr.: 450 334
*/
function calculateEncounters(oneRoute, oneId) {
  // compare the the given route (oneRoute) to all routes in the alreadyKnownRoutes-Array
  for (let i = 0; i < alreadyKnownRoutes.length; i++) {
    console.log("Compare: " + oneId + " with " + alreadyKnownRoutes[i]._id);
    intersectionOfRoutes(oneRoute, alreadyKnownRoutes[i].geoJson.features[0].geometry.coordinates, oneId, i);
  }
}


/**
 * @desc This class creates and holds a request to openweathermap
 * @author Paula Scharf 450334
 */
class WeatherRequest
{
  /**
   * @desc This is the constructor of the class WeatherRequest
   * @param indiRoute an object of the class individualRoute
   */
  constructor(encounter, id)
  {
    var lat = encounter[0];
    var long = encounter[1];

    this.resource = "https://api.openweathermap.org/data/2.5/weather?lat=" + lat
        + "&lon=" + long + "&appid=" + token.OPENWEATHERMAP_TOKEN;

    this.x = new XMLHttpRequest();
    this.x.encounter = encounter;
    this.x.id = id;
    this.x.response;
    this.x.writeRequestResultsIntoTable = this.writeRequestResultsIntoTable;
    this.x.onload = this.loadcallback;
    this.x.onerror = this.errorcallback;
    this.x.onreadystatechange = this.statechangecallback;
    this.openAndSendRequest();

  }

  openAndSendRequest()
  {
    this.x.open("GET", this.resource, true);
    this.x.send();
  }

  /**
   * @desc This function is called, when there is a change in the XMLHttpRequest "x".
   * When it is called, it writes the weather into the table and creates a infoRequest.
   */
  statechangecallback()
  {
    if (this.status == "200" && this.readyState == 4)
    {
      this.writeRequestResultsIntoTable();
    }
  }

  /**
   * @desc This function writes the weather into the asscoiated cell in the table.
   */
  writeRequestResultsIntoTable()
  {
    // show the weather as an icon
    // if you hover over this icon it will show the weather as a text
    document.getElementById("weather" + this.id).innerHTML =  "<span title='"
        + JSON.parse(this.responseText).weather[0].description
        + "'><img src=http://openweathermap.org/img/w/"
        + JSON.parse(this.responseText).weather[0].icon + ".png /img>";
  }

  /**
   * @desc This function is called when theres an error with the request.
   */
  errorcallback(e) {
    //console.dir("x: " + this.x);
    console.dir("e: " + e);
    if(this.status = 404)
    {
      document.getElementById("weatherOriginal" + this.indiRoute.positionI + "split"
          + this.indiRoute.positionJ).innerHTML = "error: no connection to the server";
    }
    else
    {
      document.getElementById("weatherOriginal" + this.indiRoute.positionI + "split"
          + this.indiRoute.positionJ).innerHTML = "errorcallback: check web-console";
    }
  }

  /**
   * @desc Thsi funcion is called when the request is loaded for the first time
   */
  loadcallback() {
    //console.dir(x);
    console.log("OpenWeatherMap: status: " + this.status + " , readyState: " + this.readyState);
  }
}



/**
* This function calculates the intersections of between all the straight lines that make up two given routes
* @param firstRoute    a route (only the coordinates)
* @param secondRoute   a second route (only the coordinates)
* @param firstId       id of the first route
* @param secondId      id of the second route
* @author name: Paula Scharf, matr.: 450 334
*/
function intersectionOfRoutes(firstRoute, secondRoute, firstId, secondId) {
  // go through all lines of the first and of the second route respectively
  for(let i = 1; i < firstRoute.length; i++) {
    for(let k = 1; k < secondRoute.length; k++) {
      var result = getIntersection(firstRoute[i-1].lat, firstRoute[i-1].lng, firstRoute[i].lat, firstRoute[i].lng, secondRoute[k-1].lat, secondRoute[k-1].lng, secondRoute[k].lat, secondRoute[k].lng);
      // if there is no intersection, the method will not return any coordinates, therefore the length of features is 0
      if(result.features.length > 0) {
        let intersectionCoordinates = result.features[0].geometry.coordinates;
        // save the encounter as JSON
        let encounter = {
          intersection: intersectionCoordinates,
          firstRoute: firstId,
          secondRoute: secondId
        };
        console.log("encounter: ");
        console.log(encounter);
        // push the encounter to the allEncounters-Array
        allEncounters.push([encounter, true]);
      }
    }
  }

}


/**
* This function calculates the coordinates of an intersection between two straight lines.
* If there is no intersection it returns false.
* @param x11   x-coord of start of the first line
* @param y11   y-coord of start of the first line
* @param x12   x-coord of end of the first line
* @param y12   y-coord of end of the first line
* @param x21   x-coord of start of the second line
* @param y21   y-coord of start of the second line
* @param x22   x-coord of end of the second line
* @param y22   y-coord of end of the second line
* @returns array of coordinates
* @author name: Paula Scharf, matr.: 450 334
*/
function getIntersection(x11, y11, x12, y12, x21, y21, x22, y22) {
  var line1 = turf.lineString([[x11, y11], [x12, y12]]);
  var line2 = turf.lineString([[x21, y21], [x22, y22]]);
  //calculate the intersection with turf
  var intersects = turf.lineIntersect(line1, line2);
  return intersects;
}
