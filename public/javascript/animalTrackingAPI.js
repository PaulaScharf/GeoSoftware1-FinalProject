// jshint esversion: 6
// jshint maxerr: 1000

"use strict";  // JavaScript code is executed in "strict mode"

/**
* @desc final project, Geosoftware1, SoSe2019
* @author name: Katharina Poppinga, matr.: 450 146; name: Paula Scharf, matr.: 450 334
*/

// please put in your own tokens at 'token.js'


// TODO: HIER AUCH JSNLOG EINBAUEN




// API used to gain animal tracking data: Movebank's REST API


// ********************** "read and accept license" section to gain the api key for your desired dataset **********************

// entity_type und study_id mitgeben!!

// D:\KPopp\Documents\WWU_Münster\Semester_4\Geosoftware_1\Projektaufgabe\GeoSoftware1-FinalProject-master\GeoSoftware1-FinalProject>curl -v -u KPoppi:U6_l1# -c cookies.txt -o license_terms.txt "https://www.movebank.org/movebank/service/direct-read?entity_type=event&study_id=16615296"

// D:\KPopp\Documents\WWU_Münster\Semester_4\Geosoftware_1\Projektaufgabe\GeoSoftware1-FinalProject-master\GeoSoftware1-FinalProject>CertUtil -hashfile license_terms.txt MD5
// MD5-Hash von license_terms.txt:
// c04dc73305ce34c21397ebbe3e8d73eb
// CertUtil: -hashfile-Befehl wurde erfolgreich ausgeführt.

// D:\KPopp\Documents\WWU_Münster\Semester_4\Geosoftware_1\Projektaufgabe\GeoSoftware1-FinalProject-master\GeoSoftware1-FinalProject>curl -v -u KPoppi:U6_l1# -b cookies.txt -o event_data.csv "https://www.movebank.org/movebank/service/direct-read?entity_type=event&study_id=16615296&license-md5=c04dc73305ce34c21397ebbe3e8d73eb"

// ergibt:
// Server auth using Basic with user 'KPoppi'
// > GET /movebank/service/direct-read?entity_type=event&study_id=16615296&license-md5=c04dc73305ce34c21397ebbe3e8d73eb HTTP/1.1
// > Host: www.movebank.org
// > Authorization: Basic S1BvcHBpOlU2X2wxIw==
// > User-Agent: curl/7.55.1
// > Accept: */*
// > Cookie: JSESSIONID=FF758EC161C69DA722F886B07E0A108A

// HTTP/1.1 200 OK
// < Date: Sun, 04 Aug 2019 20:12:22 GMT
// < Server: Apache-Coyote/1.1
// < Content-Disposition: attachment; filename*=event.csv
// < Content-Type: text/csv
// * Replaced cookie JSESSIONID="F61ECAEFC08A13313375C6168C1EC294" for domain www.movebank.org, path /movebank, expire 0
// < Set-Cookie: JSESSIONID=F61ECAEFC08A13313375C6168C1EC294; Path=/movebank


// API-key: S1BvcHBpOlU2X2wxIw==    ???????   MUSS FÜR JEDE STUDY_ID NEU ERSTELLT WERDEN


// "Because studies are treated independently, animal and tag identifiers can be assumed to be unique within a
// study but not across studies."






/**
* Global variable which ....
* @type {????????} allRoutes
*/
let animalRoute;




// FOLGENDES IN ONLOAD-FUNKTION SCHREIBEN???

// create the initial map in the "createAnimalRouteMap"-div
let createAnimalRouteMap = L.map('createAnimalRouteMap').setView([0, 0], 2);

// OpenStreetMap tiles as a layer for the map "createAnimalRouteMap"
let oSMLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});

// add the OpenStreetMap tile layer to the map "createAnimalRouteMap"
oSMLayer.addTo(createAnimalRouteMap);




// JSDoc: * @throws request failed: [object ProgressEvent]



/**
*
*
*
*/
function getTrackingData() {


  let studyID = document.getElementById('studyID').value;

  let individualID = document.getElementById('individualID').value;

  //
  let iDs = {
    studyID: studyID,
    individualID: individualID
  };


  // ********** AJAX request for getting animal tracking data from movebank API **********
  $.ajax({
    // use a http GET request
    //type: "GET",
    type: "GET",
    // URL to send the request to
    url: "/animalTrackingAPI",
    // data type of the response
    dataType: "json",

    // data to send to the server
    data: iDs,
    //
    xhrFields: {
      withCredentials: true
    },

    // NÖTIG ODER UNSINNIG????
    // timeout set to 5 seconds
    timeout: 5000
  })

  // if the request is done successfully, ...
  .done (function (response) {

    // ... give a notice on the console that the AJAX request for getting the animal tracking API data has succeeded
    console.log("AJAX request (getting animal tracking data from API) is done successfully.");

    //
    formatAndShowAnimalRoute(response);
  })

  // if the request has failed, ...
  .fail (function (xhr, status, error) {
    // ... give a notice that the AJAX request for getting the animal tracking API data has failed and show the error-message on the console
    console.log("AJAX request (getting animal tracking data from API) has failed.", error.message);
  });

}



// TODO: HIER LÖSCHEN; NUR EINBINDEN??
/**
* Takes the coordinates of a route as valid GeoJSON (just the geometry.coordinates-part).This means this function takes one array (with all coordinates)
* containing arrays (individual long-lat-pairs) of a route.
* Swaps these coordinate-pairs. Returns one array containing objects (not arrays!) with the routes' coordinates as lat-long-pairs.
*
* @author Katharina Poppinga 450146
* @param longLatCoordinatesRoute - coordinates of a route as valid GeoJSON (just the geometry.coordinates-part, array containing arrays)
* @return latLongCoordinatesRoute - one array containing objects (not arrays!) with the coordinates of the route as lat-long-pairs
*/
function swapGeoJSONsLongLatToLatLongOrder(longLatCoordinatesRoute) {

  // point with lat,long-order of its coordinate
  let latLong;

  // array for (later in this function) containing the route-coordinates with its points as objects in lat,long-coordinate-order
  var latLongCoordinatesRoute = [];

  let c;
  // loop "over" all points in given route
  for (c = 0; c < longLatCoordinatesRoute.length; c++){

    // swap current long,lat coordinate (array) to lat,long coordinate (object)
    latLong = L.GeoJSON.coordsToLatLng(longLatCoordinatesRoute[c]);

    // write new built lat,long-coordinate-pair (as an object) into the array latLongCoordinatesRoute, for getting the given route with swapped coordinates
    latLongCoordinatesRoute.push(latLong);
  }

  // return the given route with swapped coordinates as one array containing objects (not arrays!)
  return latLongCoordinatesRoute;
}





/**
* Takes the response of the Animal Tracking API request .....................
* and ......
*
*
* @private
* @author Katharina Poppinga 450146
* @param response response of the ......... request ........
*/
function formatAndShowAnimalRoute(response) {

  //
  let locations = response.individuals[0].locations;

  //
  let animalRouteGeoJSON = makeAnimalRouteGeoJSON(locations);



  // timestamps are provided in milliseconds since 1970-01-01 UTC

  let firstTimestamp = response.individuals[0].locations[0].timestamp;

  // TODO: timestamp von Epoch in unser Format (date: "2019-08-13", time: "23:23") konvertieren

  var myDate = new Date(firstTimestamp * 1000);
  //console.log(myDate);
  //let test = myDate.toGMTString() + "<br>" + myDate.toLocaleString()
  //console.log(test);



  // create ....
  animalRoute = {
    study_id: response.individuals[0].study_id,
    individualTaxonCanonicalName: response.individuals[0].individual_taxon_canonical_name,
    // TODO: stringify wegbekommen
    geoJson: JSON.stringify(animalRouteGeoJSON),
    // date of the first entry in the locations-array
    date: ".",
    // time of the first entry in the locations-array
    time: ".",
    madeBy: "animal",
    what: "route",
    status: "new"
  };

  console.log("animalroute: ", animalRoute);


  //
  showAnimalRoute(animalRoute);


}



/**
* Takes the locations-part of the response from the animal tracking API .....................
* and makes a route (as a GeoJSON feature) from/of the individual lat- and long-coordinates.......
*
*
* @private
* @author Katharina Poppinga 450146
* @param locations array of ...............
* @return animalRouteGeoJSON - the locations of the animalroute as a GeoJSON FeatureCollection
*/
function makeAnimalRouteGeoJSON(locations) {

  // coordinates are in WGS84

  // new array for the coordinates of the route, written in GeoJSON (only the geometry.coordinates part of the GeoJSON format)
  let coordinatesGeoJSON = [];


  //
  let lat, long;
  //
  for (let i = 0; i < locations.length; i++) {

    //
    lat = locations[i].location_lat;
    long = locations[i].location_long;

    // adding the i-th coordinate-pair to the new array coordinatesGeoJSON
    coordinatesGeoJSON.push([long, lat]);
  }


  // creating the GeoJSON FeatureCollection output by setting its attributes:
  let animalRouteGeoJSON = {

    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        properties: {},
        geometry: {
          type: "LineString",
          // insert the new array coordinatesGeoJSON
          coordinates: coordinatesGeoJSON
        }
      }
    ]
  };

  //
  return animalRouteGeoJSON;
}



/**
*
*
*
* @private
* @author Katharina Poppinga 450146
* @param animalroute
*/
function showAnimalRoute(animalRoute) {

  //
  document.getElementById('animalName').innerHTML = animalRoute.individualTaxonCanonicalName;
  document.getElementById('animalDateTime').innerHTML = animalRoute.date + ", " + animalRoute.time;


  // **************** show animalroute in map "createAnimalRouteMap" ****************

  let animalRouteGeoJSON = JSON.parse(animalRoute.geoJson);

  // extract the coordinates of the animalroute
  // TODO: vorher stringify löschen, dann hier parse löschen
  //let coordinatesGeoJSON = animalRoute.geoJson.features[0].geometry.coordinates;
  let coordinatesGeoJSON = animalRouteGeoJSON.features[0].geometry.coordinates;

  //
  let coordinatesLatLong = swapGeoJSONsLongLatToLatLongOrder(coordinatesGeoJSON);

  // ... center the map on the first point of the animalroute
  createAnimalRouteMap.setView([coordinatesLatLong[0].lat, coordinatesLatLong[0].lng], 4);

  // make a leaflet-polyline from the coordinates and show this polyline in orange in the map
  let polylineOfRoute = L.polyline(coordinatesLatLong, {color: '#ec7e00'}, {weight: '3'});
  polylineOfRoute.addTo(createAnimalRouteMap);
}



/**
*
*
*
* @author Katharina Poppinga 450146
*/
function postAnimalRoute() {

  // if there is no animalroute gotten/chosen from movebank API ...
  if (typeof animalRoute === "undefined") {
    // ... tell the user that he/she first has to choose an animalroute by getting tracking data of a study from movebank API
    alert("First, you have to choose an animalroute by getting tracking data of a study from movebank API.")
  }
  // if there is an animalroute gotten/chosen from movebank API ...
  else {

    // da global variable, nochmal prüfen:

    // check whether animalRoute is valid JSON that can be parsed, if not throw an exception and tell the user .....???
    try {
      JSON.stringify(animalRoute);
    }
    catch (exception){
      //
      alert("The animalroute has no valid JSON syntax.\n" + exception);
      // .........
      return;
    }

    // if there is no exception thrown, .......... parse the ....... into object ........
    // json prüfen, beides????????
    let animalRouteJSON = JSON.parse(animalRoute.geoJson);


    //geojson prüfen
    //
    if (validateGeoJSON(animalRouteJSON)) {

      // ... save this route in the database "routeDB":

      // ********** AJAX request for posting the animalroute into the database "routeDB" **********
      $.ajax({
        // use a http POST request
        type: "POST",
        // URL to send the request to
        url: "/item/createAnimal",
        // data to send to the server
        data: animalRoute,

        // NÖTIG ODER UNSINNIG????
        //xhrFields: {
        //withCredentials: true
        //  },

        // NÖTIG ODER UNSINNIG????
        // timeout set to 5 seconds
        timeout: 5000
      })

      // if the request is done successfully, ...
      .done (function (response) {
        // ... give a notice on the console that the AJAX request for posting the animalroute has succeeded
        console.log("AJAX request (posting animalroute) is done successfully.");

      })

      // if the request has failed, ...
      .fail (function (xhr, status, error) {
        // ... give a notice that the AJAX request for posting the animalroute has failed and show the error-message on the console
        console.log("AJAX request (posting animalroute) has failed.", error.message);
      });

      //
    } else {

      alert("The GeoJSON-part of the animalroute has no valid syntax.\n" + exception);
    }
  }
}
