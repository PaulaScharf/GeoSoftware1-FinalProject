// jshint esversion: 8
// jshint maxerr: 1000

"use strict";  // JavaScript code is executed in "strict mode"

/**
* @desc final project, Geosoftware1, SoSe2019
* @author name: Katharina Poppinga, matr.: 450 146; name: Paula Scharf, matr.: 450 334
*/

// please put in your own tokens at 'token.js'


//
var appender = JL.createAjaxAppender("Appender");
appender.setOptions({
  "maxBatchSize": 100
});

JL().setOptions({
  "appenders": [appender]
});


// ********************************** Weather request - OpenWeatherMap API **********************************

/**
* @desc This class creates and holds a request to openweathermap.
* @author Paula Scharf 450334
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
    var lat = intersection[0];
    var long = intersection[1];

    //
    this.resource = "https://api.openweathermap.org/data/2.5/weather?lat=" + lat + "&lon=" + long + "&appid=" + token.OPENWEATHERMAP_TOKEN;

    //
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
    //console.dir("x: " + this.x);
    console.dir("e: " + e);
    //
    if (this.status === 404)
    {
      document.getElementById("weather" + (this.id)).innerHTML = "Error: No connection to the server.";

      // KOMMENTAR ANPASSEN
      // log the .... exception to the server and .....
      JL("weatherRequestError404").fatalException("Error: No connection to the server, Status-Code 404", e);
    }

    //
    else
    {
      document.getElementById("weather" + (this.id)).innerHTML = "Errorcallback: Check web-console.";
      console.dir(e);

      //
      JL("weatherRequestError").fatalException("Error: Status-Code " + this.status, e);
    }
  }


  /**
  * @desc This function is called when the request is loaded for the first time.
  */
  loadcallback() {
    //console.dir(x);
    console.log("OpenWeatherMap: status: " + this.status + " , readyState: " + this.readyState);
  }
}



// ***************************** Terrain and country request - Geonames API *****************************

/**
* This function makes an XMLHttpRequest to the geonames API to get context
* information (terrain and country) for a specific encounter.
* @private
* @author Paula Scharf 450 334
* @param encounter
* @param id
*/
function getNewTerrainRequest(encounter, id) {

  console.log("Get new terrain request ",  encounter._id);

  let lat = encounter.intersectionX;
  let long = encounter.intersectionY;

  //
  let resource = "http://api.geonames.org/findNearbyJSON?lat=" + lat + "&lng=" + long + "&username=" + token.usernameTerrainAPI;

  //
  let xx = new XMLHttpRequest();
  xx.writeRequestResultsIntoTable = writeRequestResultsIntoTable;
  // TODO: was ist hier updateEncounter ?
  xx.updateEncounter = updateEncounter;
  xx.id = id;
  xx.encounter = encounter;

  xx.onload = function () {
    console.log("Geonames: Status-Code: " + this.status + " , readyState: " + this.readyState);
  };

  xx.onerror = function (e) {
    //
    if (this.status === 404)
    {
      document.getElementById("country" + (this.id)).innerHTML = "Error: No connection to the server.";
      document.getElementById("terrain" + (this.id)).innerHTML = "Error: No connection to the server.";

      //
      JL("terrainRequestError404").fatalException("Error: No connection to the server, Status-Code 404", e);
    }

    //
    else
    {
      document.getElementById("country" + (this.id)).innerHTML = "Errorcallback: Check web-console.";
      document.getElementById("terrain" + (this.id)).innerHTML = "Errorcallback: Check web-console.";
      console.dir(e);

      //
      JL("terrainRequestError").fatalException("Error: Status-Code " + this.status, e);
    }
  };

  xx.onreadystatechange = function () {
    //
    if (this.status === 200 && this.readyState === 4)
    {
      this.writeRequestResultsIntoTable(this.responseText, this.id);
      // if the id of the correspondingencounter in the database is known, then save the terrain-info as an attribute
      // of the encounter in the database
      if(typeof encounter._id !== "undefined") {
        let encounter = {
          _id: this.encounter._id,
          terrain: this.responseText
        };
        this.updateEncounter(encounter);
      }
    }
  };
  xx.open("GET", resource, true);
  xx.send();
}


/**
* This function writes the request-results of the geonames-XMLHttpRequest into the encounters-table.
* @private
* @author Paula Scharf 450 334
* @param response
* @param id
*/
function writeRequestResultsIntoTable(response, id) {
  // show the terrain .....
  // .....
  if (response !== "") {
    //
    if (typeof JSON.parse(response).geonames !== "undefined" && typeof JSON.parse(response).geonames[0] !== "undefined") {
      document.getElementById("country" + (id)).innerHTML = JSON.parse(response).geonames[0].countryName;
      document.getElementById("terrain" + (id)).innerHTML = JSON.parse(response).geonames[0].fclName;
      // we could not check the status code because status 200 is returned although too many requests are made
    } else if (typeof JSON.parse(response).status !== "undefined" && JSON.parse(response).status.message === "the hourly limit of 1000 credits for geosoftw_k_p has been exceeded. Please throttle your requests or use the commercial service.") {
      document.getElementById("country" + (id)).innerHTML = "Too many requests.";
      document.getElementById("terrain" + (id)).innerHTML = "Too many requests.";
    } else {
      document.getElementById("country" + (id)).innerHTML = "Country could not be identified.";
      document.getElementById("terrain" + (id)).innerHTML = "Terrain could not be identified.";
    }
  }
}


/**
* This function comes into play when the "show confirmed" checkbox is being checked.
* It makes sure that only the confirmed encounters are being shown in the map and in the table.
* @private
* @author Paula Scharf 450 334
*/
function onlyShowConfirmed() {

  let checkbox = document.getElementById("showConfirmedCheckbox");
  //
  if (checkbox.checked === true) {
    confirmActive = true;
    showEncountersOnStartingPage();
  } else {
    confirmActive = false;
    showEncountersOnStartingPage();
  }
}
