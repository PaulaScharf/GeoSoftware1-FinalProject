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

// TEST-request-resource for getting the animal tracking data
let resource = "https://www.movebank.org/movebank/service/json-auth?&study_id=2911040&individual_local_identifiers[]=4262-84830876&sensor_type=gps";










//
$.ajax({
  // use a http GET request
  type: "GET",
  // URL to send the request to
  url: "/animalTrackingAPI",
  //url: resource,

  //
  //contentType: "application/json",
  //
  //data: resource,

  // data type of the response
  dataType: "json", //application/json?
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
  showAllAnimalRoutesOnStartingPage(response);



})

// if the request has failed, ...
.fail (function (xhr, status, error) {
  // ... give a notice that the AJAX request for getting the animal tracking API data has failed and show the error-message on the console
  console.log("AJAX request (getting animal tracking data from API) has failed.", error, error.message);
});




/**
* Takes the response of the Animal Tracking API request .....................
* and ......
*
*
* @private
* @author Katharina Poppinga
* @param response response of the ......... request ........
*/
function showAllAnimalRoutesOnStartingPage(response){

  //
  let locations = response.individuals[0].locations;

  console.log(locations);


  let animalRouteGeoJSON = makeAnimalRoute(locations);

  console.log(animalRouteGeoJSON);
  
  // TODO: mit deren return-Wert die locations in response ersetzen !!!

  // response so verändern, dass Route als GeoJSON darin enthalten ist (dazu makeAnimalRoute innerhalb dieser
  // Funktion aufrufen) und alle übrigen Attribute erhalten bleiben
  //let animalRoute = response.individuals[0]....;




  // WO DIE TIMESTAMPS SPEICHERN?



  // BEARBEITETE RESPONSE (animalRoute) AN ROUTEN-FUNKTIONEN ÜBERGEBEN
  // DIE FUNKTION AUFRUFEN, DIE DIE ANIMALROUTEN IN TB SCHREIBT
  // UND DIE FUNKTION AUFRUFEN, DIE DIE ANIMALROUTEN IN MAP SCHREIBT

  // dazu evtl. showAllRoutesOnStartingPage(response) VERALLGEMEINERN UND EINMAL FÜR USERROUTEN UND EINMAL FÜR
  // ANIMALROUTEN AUFRUFEN (Änderungen nötig, da TB anders aussieht und andere Attribute im Request) !!!!!!



  // BEARBEITETE RESPONSE (animalRoute) AN ENCOUNTERS-FUNKTION ÜBERGEBEN

}



/**
* Takes the locations-part of the response from the animal tracking API .....................
* and makes a route (as a GeoJSON feature) from/of the individual lat- and long-coordinates.......
*
*
* @private
* @author Katharina Poppinga
* @param locations array of ...............
* @return animalRouteGeoJSON - the locations of the animalroute as a GeoJSON FeatureCollection
*/
function makeAnimalRoute(locations){

  // timestamps are provided in milliseconds since 1970-01-01 UTC
  // coordinates are in WGS84

  // new array for the coordinates of the route, written in GeoJSON (only the geometry.coordinates part of the GeoJSON format)
  let coordinatesGeoJSON = [];

  /*
  // HIER NUR TEST, LETZTENDLICH/STATTDESSEN AUS RESPONSE ÜBERNEHMEN!!!!
  locations = [
  {"timestamp":1212240595000,"location_long":-89.7400582,"location_lat":-1.372675},
  {"timestamp":1212240618999,"location_long":-89.740053,"location_lat":-1.3726544},
  {"timestamp":1212246021998,"location_long":-89.7400575,"location_lat":-1.3726589},
  {"timestamp":1212251449999,"location_long":-89.7400497,"location_lat":-1.3726499},
  {"timestamp":1212256913000,"location_long":-89.7400693,"location_lat":-1.3726749}
];
*/


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
      type: 'Feature',
      properties: {           // BISHER: no properties set
      },
      geometry: {
        type: 'LineString',
        // insert the new array coordinatesGeoJSON
        coordinates: coordinatesGeoJSON
      }
    }
  ]
};

//
return animalRouteGeoJSON;
}




// **************************************************************************************************************************


// JSDOC ANPASSEN!!!
// KOMMENTARE ANPASSEN!!!
// TODO: FUNKTION SO FAST DOPPELT VORHANDEN; ÄNDERN
/**
* Takes the response of the ........
*
*
* @private
* @author Katharina Poppinga
* @param response response of AJAX GET-request for ....
*/
function showAllAnimalRoutesOnStartingPage(response) {

  //console.log("Show animalRoutes:", response);

  // coordinates of a route (in GeoJSONs long-lat order)
  var coordinatesRoute;

  // folgendes if LÖSCHEN ?????????
  // if there are no routes in the database ...
  if (typeof response[0] === "undefined") {
    // if there are routes in the database ... :
  } else {

    // loop "over" all routes in the current database "routeDB"
    for (let i = 0; i < response.length; i++) {


      // NEUE/WEITERE ATTRIBUTE NOCH DAZU ....
      // show the i-th route with a consecutive number and its ....................... in the table "animalRoutesTable" on starting page
      createAndWriteTableWithSevenCells(i, "animalRoutesTable");



      // ************** show the i-th route in the map "allRoutesMap" on the starting page, therefore do the following steps: **************

      // outsource the creation of the routeCheckbox for showing or not showing the i-th route in the map
      checkbox(i);

      // extract the coordinates of the i-th route
      coordinatesRoute = swapGeoJSONsLongLatToLatLongOrder(response[i].geoJson.features[0].geometry.coordinates);

      // for the first route of the database ... HIER NICHT, DA SCHON FÜR USER GEMACHT?
      //if (i === 0) {
      // ... center the map on the first point of the first route
      //allRoutesMap.setView([coordinatesRoute[i].lat, coordinatesRoute[i].lng], 3);
      //}

      // make a leaflet-polyline from the coordinatesLatLongOrder
      let polylineOfRoute = L.polyline(coordinatesRoute, {color: '#ec0000'}, {weight: '3'});

      // add the polyline to the array polylineRoutesLatLongArray for being able to address the polylines(routes) by numbers (kind of IDs) (needed for checkboxes)
      polylineRoutesLatLongArray.push([polylineOfRoute, true]);

      // add the i-th polyline-element of the array polylineRoutesLatLongArray to the routesGroup and therefore to the map "allRoutesMap"
      polylineRoutesLatLongArray[i][0].addTo(routesGroup);
    }
  }
}
