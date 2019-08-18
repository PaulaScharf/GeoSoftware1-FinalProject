// jshint esversion: 8
// jshint maxerr: 1000

"use strict";  // JavaScript code is executed in "strict mode"

/**
* @desc final project, Geosoftware1, SoSe2019
* @author name: Katharina Poppinga, matr.: 450 146; name: Paula Scharf, matr.: 450 334
*/

// please put in your own tokens at 'token.js'


// enable to send JSNLog messages to the server
let appender = JL.createAjaxAppender("Appender");
appender.setOptions({
  "maxBatchSize": 100
});
JL().setOptions({
  "appenders": [appender]
});


// ********************************** Weather request - OpenWeatherMap API **********************************

/**
* @desc This class creates and holds a request to openweathermap.
* @author Paula Scharf, matr.: 450334
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
    let lat = intersection[0];
    let long = intersection[1];

    // the url for the weather-request
    this.resource = "https://api.openweathermap.org/data/2.5/weather?lat=" + lat + "&lon=" + long + "&appid=" + token.OPENWEATHERMAP_TOKEN;

    // the weather-request as an xmlhttprequest
    this.x = new XMLHttpRequest();
    this.x.intersection = intersection;
    this.x.id = id;
    this.x.writeRequestResultsIntoTable = this.writeRequestResultsIntoTable;
    this.x.onload = this.loadcallback;
    this.x.onerror = this.errorcallback;
    this.x.onreadystatechange = this.statechangecallback;
    this.openAndSendRequest();
  }


  /**
  * @desc
  *
  */
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
    if ((this.status === 200 || this.status === 429) && this.readyState === 4)
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
      if (this.status === 200)
      document.getElementById("weather" + (this.id)).innerHTML = "<span title='" + JSON.parse(this.responseText).weather[0].description + "'><img src=http://openweathermap.org/img/w/" + JSON.parse(this.responseText).weather[0].icon + ".png /img>";
    }
    if (this.status === 429){
      document.getElementById("weather" + (this.id)).innerHTML = "Too many requests.";
    }
  }


  /**
  * @desc This function is called when there is an error with the request.
  */
  errorcallback(e) {

    console.dir("e: " + e);

    if (this.status === 404) {
      document.getElementById("weather" + (this.id)).innerHTML = "Error: No connection to the server.";

      // send JSNLog message to the own server-side to tell that there is no connection to the OWM API server
      JL("weatherRequestError404").fatalException("Error: No connection to the server, Status-Code 404", e);
    }
    else if (this.status === 0) {
      document.getElementById("weather" + (this.id)).innerHTML = "Error: No connection to the internet";

      // send JSNLog message to the own server-side to tell that there is an error, including the status-code
      JL("weatherRequestError").fatalException("Error: Status-Code " + this.status, e);
    }
    else {
      document.getElementById("weather" + (this.id)).innerHTML = "Errorcallback: Check web-console.";
      console.dir(e);

      // send JSNLog message to the own server-side to tell that there is an error, including the status-code
      JL("weatherRequestError").fatalException("Error: Status-Code " + this.status, e);
    }
  }


  /**
  * @desc This function is called when the request is loaded for the first time.
  */
  loadcallback() {
    console.log("OpenWeatherMap: status: " + this.status + " , readyState: " + this.readyState);
  }
}



// ***************************** Terrain and country request - Geonames API *****************************

/**
* This function makes an XMLHttpRequest to the geonames API to get context
* information (terrain and country) for a specific encounter.
* @private
* @author Paula Scharf, matr.: 450334
* @param encounter
* @param id
*/
function getNewTerrainRequest(encounter, id) {
  console.log("new terrain request");

  let lat = encounter.intersectionX;
  let long = encounter.intersectionY;

  // the url for the geonames-request
  let resource = "http://api.geonames.org/findNearbyJSON?lat=" + lat + "&lng=" + long + "&username=" + token.usernameTerrainAPI;

  // the geonames-request as an xmlhttprequest
  let xx = new XMLHttpRequest();
  xx.writeRequestResultsIntoTable = writeRequestResultsIntoTable;
  xx.postEncounter = postEncounter;
  xx.id = id;
  xx.encounter = encounter;
  xx.onload = function () {

  console.log("Geonames: Status-Code: " + this.status + " , readyState: " + this.readyState);
  };

  xx.onerror = function (e) {
    if (this.status === 404) {
      // send JSNLog message to the own server-side to tell that there is no connection to the Geonames API server
      JL("terrainRequestError404").fatalException("Error: No connection to the server, Status-Code 404", e);
    } else {
      console.dir(e);
      console.dir(this.status);
      // send JSNLog message to the own server-side to tell that there is an error, including the status-code
      JL("terrainRequestError").fatalException("Error: Status-Code " + this.status, e);
    }
  };

  xx.onreadystatechange = function () {
    if (this.readyState === 4)
    {
      // if the id of the correspondingencounter in the database is known, then save the terrain-info as an attribute
      // of the encounter in the database
      this.encounter.terrain = this.responseText;
      this.postEncounter(encounter);

    }
  };
  xx.open("GET", resource, true);
  xx.send();
}


/**
* This function writes the request-results of the geonames-XMLHttpRequest into the encounters-table.
* @private
* @author Paula Scharf, matr.: 450334
* @param response
* @param id
*/
function writeRequestResultsIntoTable(response, id) {
  // show the terrain or possible errors in the encounters table
  if (response !== "") {
    // if the terrain and country could be identified
    if (typeof JSON.parse(response).geonames !== "undefined" && typeof JSON.parse(response).geonames[0] !== "undefined") {
      document.getElementById("country" + (id)).innerHTML = JSON.parse(response).geonames[0].countryName;
      document.getElementById("terrain" + (id)).innerHTML = JSON.parse(response).geonames[0].fclName;
      // if too many requests to the api were made
    } else if (typeof JSON.parse(response).status !== "undefined" && JSON.parse(response).status.message === "the hourly limit of 1000 credits for geosoftw_k_p has been exceeded. Please throttle your requests or use the commercial service.") {
      document.getElementById("country" + (id)).innerHTML = "Too many requests.";
      document.getElementById("terrain" + (id)).innerHTML = "Too many requests.";
      // if the country could not identify the coordinates
    } else {
      document.getElementById("country" + (id)).innerHTML = "Country could not be identified.";
      document.getElementById("terrain" + (id)).innerHTML = "Terrain could not be identified.";
    }
    // if there is no internet connection the response of the request is empty
  } else {
    document.getElementById("country" + (id)).innerHTML = "No connection.";
    document.getElementById("terrain" + (id)).innerHTML = "No connection.";
  }
}

/**
 * This function calls the '/encounter/create' route with ajax, to save a given encounter in the database.
 * @author Paula Scharf, matr.: 450334
 * @param encounter - the encounter to be saved
 * @param id - the index of the encounter in the global encounters-array ("allEncounters")
 */
function postEncounter(encounter, id) {

    $.ajax({
        // use a http POST request
        type: "POST",
        // URL to send the request to
        url: "/encounter/create",
        // type of the data that is sent to the server
        contentType: "application/json; charset=utf-8",
        //
        data: JSON.stringify(encounter),
        // timeout set to 10 seconds
        timeout: 10000
    })

    // if the request is done successfully, ...
        .done (function (response) {
            if (typeof id !== "undefined") {
                allEncounters[id][0]._id = response;
                shareButton(id);
            }
            // ... give a notice on the console that the AJAX request for pushing an encounter has succeeded
            console.log("AJAX request (posting an encounter) is done successfully.");
        })

        // if the request has failed, ...
        .fail(function (xhr, status, error) {
            // ... give a notice that the AJAX request for posting an encounter has failed and show the error on the console
            console.log("AJAX request (posting an encounter) has failed.", error);

            // send JSNLog message to the own server-side to tell that this ajax-request has failed because of a timeout
            if (error === "timeout") {
                JL("ajaxCreateEncounterTimeout").fatalException("ajax: '/encounter/create' timeout");
            }
        });
}
