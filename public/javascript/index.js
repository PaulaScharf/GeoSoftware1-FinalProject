// jshint esversion: 8
// jshint maxerr: 1000

"use strict";  // JavaScript code is executed in "strict mode"

/**
* @desc final project, Geosoftware1, SoSe2019
* @author name: Katharina Poppinga, matr.: 450 146; name: Paula Scharf, matr.: 450 334
*/

// please put in your own tokens at 'token.js'



// TODO: KOMMENTARE (u.a. IN CHECKBOX-FUNKTIONEN) an consecutive nr mit 1 beginnend ANPASSEN


// TODO: überall var zu let verändern



// ****************************** global variables ******************************

/**
* Global variable which contains all routes from the database routeDB. This variable is
* an array containing no, one or many arrays (one array for one route). Each of these
* inner arrays has the route-object at its first position and a boolean indicator, representing
* whether the route is currently displayed or not, at its second position.
* @type {Array} allRoutes
*/
let allRoutes = [];


// TODO: im hierdrunterstehenden JSDoc die .......... ausfüllen mit Beschreibung des 4. elements des arrys ("no search" etc.)
/**
* Global variable which contains all encounters from the database routeDB. This variable is
* an array containing no, one or many arrays (one array for one encounter). Each of these
* inner arrays has
* the encounter-object at its first position,
* a boolean indicator, representing whether the encounter is currently displayed or not, at its second position,
* an object containing the indices of the corresponding routes in the allRoutes-array at its third position and
* a .............. at its fourth position.
* @type {Array}
*/
let allEncounters = [];


/**
* Global variable that indicates if the checkbox for only showing confirmed encounters is checked
* @type {boolean}
*/
let confirmActive = false;


/**
*
*
* @type {map}
*/
let indexMap;


/**
*
*
* @type {featureGroup}
*/
let routesGroup;


/**
*
*
* @type {featureGroup}
*/
let encountersGroup;




// TODO: refactor names

/**
* array for the routes which are shown in the map "indexMap"
* @type {Array}
*/
let polylineRoutesLatLongArray = [];


/**
* array for the encounters which are shown in the map "indexMap"
* @type {Array}
*/
let encountersLatLongArray = [];



// ****************************** functions ******************************

/**
*
*
*
* @author Katharina Poppinga 450146
*/
function getAndShowData() {


  // ****************************** map ******************************

  // create the initial map in the "indexMap"-div, the proper map extract will be set later
  indexMap = L.map('indexMap').setView([0, 0], 3);

  // OpenStreetMap tiles as a layer for the map "indexMap"
  let oSMLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  });

  // add the OpenStreetMap tile layer to the map "indexMap"
  oSMLayer.addTo(indexMap);

  // create a layerGroup for all routes, add this group to the existing map "indexMap"
  routesGroup = L.featureGroup().addTo(indexMap);

  // create a layerGroup for all encounters, add this group to the existing map "indexMap"
  encountersGroup = L.featureGroup().addTo(indexMap);


  // ********** AJAX request for reading all routes (NUR ROUTES ODER AUCH BEGEGNUNGEN???) out of the database
  // and writing them into ......(ANPASSEN AN BEIDE FUNKTIONSAUFRUFE!!!!!) **********
  $.ajax({
    // use a http GET request
    type: "GET",
    // URL to send the request to
    url: "/routes/readAll",
    // data type of the response
    dataType: "json",
    // timeout set to 5 seconds
    timeout: 5000
  })

  // if the request is done successfully, ...
  .done (function (response) {

    // ... give a notice on the console that the AJAX request for reading all routes has succeeded
    console.log("AJAX request (reading all routes) is done successfully.");

    //
    writeAllRoutesInTheGlobalArray(response);

    // ... show all read routes on starting page (in table and in map), as the following function does:
    showAllRoutesOnStartingPage();

    //
    getAllEncountersAndShow();
  })

  // if the request has failed, ...
  .fail (function (xhr, status, error) {

    // ... give a notice that the AJAX request for reading all routes has failed and show the error on the console
    console.log("AJAX request (reading all routes) has failed.", error);

    // TODO: ÜBERPRÜFEN, OB SCHREIBWEISE RICHTIG
    if (error === "timeout") {
      JL("ajaxReadingAllRoutesTimeout").fatalException("ajax: '/routes/readAll' timeout");
    }
  });
}



/**
* This function takes the response of the ajax-call for getting all routes and writes it into to global array "allRoutes"
* @author  Paula Scharf 450334
* @param response - response of the ajax-call for getting all routes
*/
function writeAllRoutesInTheGlobalArray(response) {
  //
  for (let i = 0; i < response.length; i++) {
    //
    allRoutes.push([response[i], true]);

    // TODO: ATTRIBUT UMBENENNEN, DA ES KEIN GEOJSON IST

    allRoutes[i][0].geoJson.features[0].geometry.coordinates = swapGeoJSONsLongLatToLatLongOrder_Arrays(allRoutes[i][0].geoJson.features[0].geometry.coordinates);
  }
}



// TODO: refactor all for-loops, so that they use "current..."
// JSDOC ANPASSEN!!!
/**
* Writes routes into table and shows routes in map (both on starting page) ............
*
* @private
* @author Katharina Poppinga 450146
*/
function showAllRoutesOnStartingPage() {

  console.log(allRoutes);

  // coordinates of a route (in GeoJSONs long-lat order)
  let coordinatesRoute;

  // loop "over" all routes in the current database "routeDB"
  for (let i = 0; i < allRoutes.length; i++) {

    let currentRoute = allRoutes[i];

    //
    if (currentRoute[0].madeBy === "user") {
      // show the i-th userroute with a consecutive number and its creator, name, date, time and type in the table "routesTable" on starting page
      createUserRouteTable(i, currentRoute[0].creator, currentRoute[0].name, currentRoute[0].date, currentRoute[0].time, currentRoute[0].type, "routesTable");
    }

    //
    else if (currentRoute[0].madeBy === "animal") {
      // show the i-th animalroute with a consecutive number and its studyID, individualTaxonCanonicalName, date and time in the table "animalRoutesTable" on starting page
      createAnimalRouteTable(i, currentRoute[0].study_id, currentRoute[0].individualTaxonCanonicalName, currentRoute[0].date, currentRoute[0].time, "animalRoutesTable");
    }

    // outsource the creation of the checkbox for showing or not showing the i-th route in the map
    routeCheckbox(i);

    //
    if (currentRoute[0].madeBy === "user") {
      updateButton(i, currentRoute[0]._id);
    }

    deleteButton(i, currentRoute[0]._id);


    // ************** show the i-th route in the map "indexMap" on the starting page, therefore do the following steps: **************

    // TODO: ATTRIBUT UMBENENNEN, DA ES KEIN GEOJSON IST

    // extract the coordinates of the i-th route
    coordinatesRoute = currentRoute[0].geoJson.features[0].geometry.coordinates;

    //
    let polylineOfRoute;

    // if the current route is a userroute, make a leaflet-polyline from the coordinatesRoute and show this polyline in red in the map
    if (currentRoute[0].madeBy === "user") {
      polylineOfRoute = L.polyline(coordinatesRoute, {color: '#ec0000'}, {weight: '3'});
    }
    // if the current route is an animalroute, make a leaflet-polyline from the coordinatesRoute and show this polyline in orange in the map
    else if (currentRoute[0].madeBy === "animal") {
      polylineOfRoute = L.polyline(coordinatesRoute, {color: '#ec7e00'}, {weight: '3'});
    }

    // add the polyline to the array polylineRoutesLatLongArray for being able to address the polylines(routes) by numbers (kind of IDs) (needed for checkboxes)
    polylineRoutesLatLongArray.push(polylineOfRoute);

    if (currentRoute[1]) {
      // add the i-th polyline-element of the array polylineRoutesLatLongArray to the routesGroup and therefore to the map "indexMap"
      polylineRoutesLatLongArray[i].addTo(routesGroup);
      // for the first route of the database ...
      if (i === allRoutes.length-1) {
        // ... center the map on the first point of the first route
        indexMap.fitBounds(routesGroup.getBounds());
      }
    }
  }
}



/**
* This function retrieves all encounters from the database and displays them on the map and the table.
* Also if a route is deleted, added or updated the encounters in the database are also adjusted with this function.
* @author name: Paula Scharf, matr.: 450 334
*/
function getAllEncountersAndShow() {
  //
  $.ajax({
    // use a http GET request
    type: "GET",
    // URL to send the request to
    url: "/encounter/readAll",
    // data type of the response
    dataType: "json",
    // timeout set to 5 seconds
    timeout: 5000
  })

  // if the request is done successfully, ...
  .done (function (response) {

    // TODO: FOLGENDES IN SEPARATE FUNKTION AUSLAGERN, ANSTATT DIREKT IM AJAX?  ***********************************
    //
    for (let i = 0; i < response.length; i++) {
      let currentEncounter = response[i];

      //
      let noOfRoutes = {firstRoute: undefined, secondRoute: undefined};
      // go through all routes, to determine their index in the allRoutes-array and give that information
      // to the encounter
      for (let k = 0; k < allRoutes.length; k++) {
        if (allRoutes[k][0]._id === currentEncounter.firstRoute) {
          noOfRoutes.firstRoute = k;
        }
        //
        else if (allRoutes[k][0]._id === currentEncounter.secondRoute) {
          noOfRoutes.secondRoute = k;
        }
      }
      //
      if (typeof noOfRoutes.firstRoute === "undefined" || typeof noOfRoutes.secondRoute === "undefined") {
        console.log("undefined");
        // delete the current encounter from the db if any of the corresponding routes are missing
        deleteEncounter(currentEncounter._id);
        //
      } else {
        let parameters = {
          routesSelected: true,
          search: "no search"
        };
        // give true as the second argument to indicate that all corresponding routes for this encounter are selected
        // give true as the fourth argument to indicate that ther is either no search active or this encounter is
        // currently being searched for
        allEncounters.push([currentEncounter, parameters, noOfRoutes]);
      }
    }

    // ************************************************************************************************************

    // check if a route was added or updated and adjust the encounters accordingly
    checkForNewRoute(allRoutes, true);

    //console.log(allEncounters);

    showEncountersOnStartingPage();

    // ... give a notice on the console that the AJAX request for reading all encounters has succeeded
    console.log("AJAX request (reading all encounters) is done successfully.");
  })

  // if the request has failed, ...
  .fail (function (xhr, status, error) {
    // ... give a notice that the AJAX request for reading all routes has failed and show the error on the console
    console.log("AJAX request (reading all encounters) has failed.", error);

    // TODO: ÜBERPRÜFEN, OB SCHREIBWEISE RICHTIG
    if (error === "timeout") {
      JL("ajaxReadAllEncountersTimeout").fatalException("ajax: '/encounter/readAll' timeout");
    }
  });
}



// JSDOC ANPASSEN!!!
/**
* This function displays all encounters in the map and in the table after they have been retrieved from the database.
* @private
* @author name: Paula Scharf, matr.: 450 334
*/
function showEncountersOnStartingPage() {
  // fill the table for the encounters with the encounters-array
  fillEncountersTable();
  fillEncountersMap();
}



/**
*  This function fills the table for the encounters with all encounters that are selected or searched for.
* If the global variable "confirmActive" is set to true it also only shows confirmed encounters.
*
* @private
* @author Paula Scharf, matr.: 450 334
*/
function fillEncountersTable() {
  // clear the table
  deleteAllChildrenOfElement("encountersTable");
  // fill the table
  for (let i = 0; i < allEncounters.length; i++) {
    let currentEncounter = allEncounters[i];
    // only show encounters, which are also shown on the map
    if (currentEncounter[1].routesSelected &&
      (currentEncounter[1].search === "no search" || currentEncounter[1].search === "searched for") &&
      //
      (confirmActive ? (currentEncounter[0].tookPlace === "yes") : true)) {
        createEncountersTable(i, currentEncounter[2].firstRoute + 1, currentEncounter[2].secondRoute + 1, "encountersTable");
        // if the encounter is new, then create a new weather request and a new terrain request
        if (typeof currentEncounter[0].weather === 'undefined') {
          currentEncounter[0].weather = new WeatherRequest([currentEncounter[0].intersectionX, currentEncounter[0].intersectionY], i);
          // if the encounter is old, reuse the response of the already existing corresponding weather and terrain requests
        } else {
          currentEncounter[0].weather.x.writeRequestResultsIntoTable();
        }
        if (typeof currentEncounter[0].terrain === 'undefined') {
          getNewTerrainRequest(currentEncounter[0], i);
        } else {
          writeRequestResultsIntoTable(currentEncounter[0].terrain, i);
        }
        let isFirstPlanned = (allRoutes[currentEncounter[2].firstRoute][0].type === "planned");
        let isSecondPlanned = (allRoutes[currentEncounter[2].secondRoute][0].type === "planned");

        encounterCheckbox(i, (isFirstPlanned || isSecondPlanned));
        shareButton(i);
      }
    }
  }


  /**
  * This function fills the map with all encounters that are selected or searched for.
  * If the global variable "confirmActive" is set to true it also only shows confirmed encounters.
  * @private
  * @author Paula Scharf, matr.: 450 334
  */
  function fillEncountersMap() {

    encountersGroup.eachLayer(function (layer) {
      encountersGroup.removeLayer(layer);
    });

    encountersLatLongArray = [];
    // loop "over" all encounters in the current database "routeDB"
    for (let i = 0; i < allEncounters.length; i++) {
      let currentEncounter = allEncounters[i];
      let color = (currentEncounter[0].tookPlace === "yes") ? "#009d42" : "#000bec";

      // make a circle out of the current encounter
      let currentCircle = L.circle([currentEncounter[0].intersectionX, currentEncounter[0].intersectionY],
        {radius: 200, color: color, fillColor: color, fillOpacity: 0.5});
        let agent = ((allRoutes[currentEncounter[2].firstRoute][0].madeBy === "animal") ?
        allRoutes[currentEncounter[2].firstRoute][0].individualTaxonCanonicalName : allRoutes[currentEncounter[2].firstRoute][0].creator);
        currentCircle.bindPopup("encounter number " + (i + 1) + " between " + agent + " and " + allRoutes[currentEncounter[2].secondRoute][0].creator);
        // add the circle to the array encountersLatLongArray
        encountersLatLongArray.push(currentCircle);
        if(currentEncounter[1].routesSelected &&
          (currentEncounter[1].search === "no search" || currentEncounter[1].search === "searched for") &&
          (confirmActive ? (currentEncounter[0].tookPlace === "yes") : true)) {
            // add the encountersLatLongArray to the encountersGroup
            encountersLatLongArray[i].addTo(encountersGroup);
          }
        }
      }


      /**
      * Creates a routeCheckbox - inside the fixed corresponding table cell - that corresponds to the individual route, which has the same consecutive
      * number as the id of the routeCheckbox.
      * A selected/checked routeCheckbox adds its corresponding route to the "routesGroup", therefore this route is shown in the map "indexMap".
      * A deselected routeCheckbox removes its corresponding route from the "routesGroup", therefore this route is not shown in the map "indexMap".
      *
      * @private
      * @author Katharina Poppinga
      * @param {number} cb_id - ID for the routeCheckbox to be created
      */
      function routeCheckbox(cb_id){
        // label the table cell, in which the routeCheckbox will be written, as "tableCellCheckbox"
        let tableCellCheckbox = document.getElementById("conseNum"+cb_id);

        // add a routeCheckbox (which calls the function routeSelectionForMap(cb_id) if clicked) to the content of the "tableCellCheckbox"
        tableCellCheckbox.innerHTML = tableCellCheckbox.innerHTML + " <input type='checkbox' id='routeCheckbox" +cb_id+ "' checked onclick='routeSelectionForMap("+cb_id+")' style='margin-left: 10px; margin-right: 15px;'>";
      }


      /**
      * Creates .....
      *
      *
      * @private
      * @author Katharina Poppinga 450146
      * @param i
      */
      function deleteButton(i){

        // label the table cell, in which the delete-button will be written, as "tableCellButtons"
        let tableCellDeleteButton = document.getElementById("conseNum"+i);

        let id = allRoutes[i][0]._id;

        //
        tableCellDeleteButton.innerHTML = tableCellDeleteButton.innerHTML + " <form action='/routes/delete' method='GET' name='deleteButtonForm' style='display: inline;'>" +
        "<input type='hidden' name='_id' value='" + id +"'/>" +
        "<input type='submit' value='delete' id='deleteButton" + i + "'/>" +
        "</form>";
      }


      /**
      * Creates .....
      *
      *
      *
      * @private
      * @author Katharina Poppinga 450146
      * @param i
      */
      function updateButton(i){

        // label the table cell, in which the update-button will be written, as "tableCellButtons"
        let tableCellUpdateButton = document.getElementById("conseNum"+i);

        let id = allRoutes[i][0]._id;
        //
        tableCellUpdateButton.innerHTML = tableCellUpdateButton.innerHTML + " <form action='/routes/read' method='GET' name='updateButtonForm' style='display: inline;'>" +
        "<input type='hidden' name='_id' value='" + id +"'/>" +
        "<input type='submit' value='update' id='updateButton" + i + "'/>" +
        "</form>";
      }


      /**
      * This function creates the button for sharing/saving an encounter in the encounters-table.
      * @private
      * @author Paula Scharf 450334
      * @param bt_id - number of row
      */
      function shareButton(bt_id) {
        // label the table cell, in which the routeCheckbox will be written, as "tableCellCheckbox"
        let tableCellButton = document.getElementById("share"+bt_id);

        console.log(allEncounters);
        console.log("allEncounters");

        let ids = {
          e_id : allEncounters[bt_id][0]._id,
          r1_id: allRoutes[allEncounters[bt_id][2].firstRoute][0]._id,
          r2_id: allRoutes[allEncounters[bt_id][2].secondRoute][0]._id,
        };

        // add a button (which calls the function routeSelectionForMap(bt_id) if clicked) to the content of the "tableCellCheckbox"
        tableCellButton.innerHTML = "<form action='/getSingleEncounter' method='GET' name='shareForm'>" +
        "<input type='hidden' name='e_id' value='" + ids.e_id +"'/>" +
        "<input type='hidden' name='r1_id' value='" + ids.r1_id +"'/>" +
        "<input type='hidden' name='r2_id' value='" + ids.r2_id +"'/>" +
        "<input type='submit' value='share' id='sharebutton" + bt_id + "'/>" +
        "</form>";
      }


      /**
      * This function creates the checkbox for confirming an encounter in the encounters-table.
      * @private
      * @author Paula Scharf 450334
      * @param cb_id - number of row
      */
      function encounterCheckbox(cb_id, disabled) {
        let currentEncounter = allEncounters[cb_id][0];
        // label the table cell, in which the routeCheckbox will be written, as "tableCellCheckbox"
        let tableCellCheckbox = document.getElementById("confirm"+cb_id);

        let checked;
        if (currentEncounter.tookPlace === "yes") {
          checked = true;
        } else {
          checked = false;
        }

        // add a routeCheckbox (which calls the function routeSelectionForMap(cb_id) if clicked) to the content of the "tableCellCheckbox"
        tableCellCheckbox.innerHTML = tableCellCheckbox.innerHTML + " <input type='checkbox' id='encounterCheckbox" +cb_id+ "' onclick='encounterConfirm("+cb_id+")'>";
        document.getElementById("encounterCheckbox" + cb_id).checked = checked;

        document.getElementById("encounterCheckbox" + cb_id).disabled = disabled;
      }


      /**
      * This function changes the attribute "tookPlace" of an encounter if the "confirm encounter"-checkbox is checked.
      * It also rewrites all the encounters in the map to change their color accordingly.
      * @private
      * @author Paula Scharf 450334
      * @param cb_id - number of row or number of encounter in the global array
      */
      function encounterConfirm(cb_id) {
        let checkbox = document.getElementById("encounterCheckbox" + cb_id);
        let currentEncounter = allEncounters[cb_id][0];
        let tookPlace = "";

        if (checkbox.checked === true) {
          tookPlace = "yes";
        } else {
          tookPlace = "maybe";
        }
        let encounter = {
          _id: currentEncounter._id,
          tookPlace: tookPlace
        };

        allEncounters[cb_id][0].tookPlace = tookPlace;

        updateEncounter(encounter);
        fillEncountersMap();
      }


      /**
      * This function makes an AJAX-request in order to update an encounter in the database
      * @private
      * @author Paula Scharf 450334
      * @param encounter
      */
      function updateEncounter(encounter) {
        $.ajax({
          // use a http POST request
          type: "POST",
          // URL to send the request to
          url: "/encounter/update",
          //
          data: encounter,
          // TODO: ist encounter JSON?? (dann stringifien) !!!!!!!!
          // type of the data that is sent to the server
          //contentType: "application/json; charset=utf-8",
          // timeout set to 5 seconds
          timeout: 5000
        })

        // if the request is done successfully, ...
        .done (function () {
          // ... give a notice on the console that the AJAX request for ....... has succeeded
          console.log("AJAX request (updating an encounter) is done successfully.");
        })

        // if the request has failed, ...
        .fail(function (xhr, status, error) {
          // ... give a notice that the AJAX request for .......... has failed and show the error on the console
          console.log("AJAX request (updating an encounter) has failed.", error);

          // TODO: ÜBERPRÜFEN, OB SCHREIBWEISE RICHTIG
          if (error === "timeout") {
            JL("ajaxUpdateEncounterTimeout").fatalException("ajax: '/encounter/update' timeout");
          }
        });
      }


      /**
      * Checks whether a routeCheckbox with given ID is checked (picked) or not (deselected) for customizing the shown routes in the map "indexMap".
      * If the routeCheckbox is checked (picked), the corresponding route (route with the same consecutive number or the same "element-number" in the
      * polylineRoutesLatLongArray (global variable) as the ID of the routeCheckbox) is added to the routesGroup (global variable) and therefore shown in the map "indexMap".
      *
      * @private
      * @author Katharina Poppinga 450146, Paula Scharf 450334
      * @param {number} cb_id - ID of the routeCheckbox
      */
      function routeSelectionForMap(cb_id){

        // label the routeCheckbox
        let checkBox = document.getElementById("routeCheckbox" + cb_id);

        // if the routeCheckbox is picked ...
        if (checkBox.checked === true){
          // ... show the corresponding route in the map "indexMap" (by adding this route to the layerGroup "routesGroup")
          routesGroup.addLayer(polylineRoutesLatLongArray[cb_id]);
          // set to true to indicate, that the route is currently selected
          allRoutes[cb_id][1] = true;
          // get all ids of encounters which have to be added
          let idsOfEncountersToBeAdded = encountersToBeAdded(cb_id);

          // add the encounters
          for (let i = 0; i < idsOfEncountersToBeAdded.length; i++) {
            encountersGroup.addLayer(encountersLatLongArray[idsOfEncountersToBeAdded[i]]);
            // set to true to indicate, that the route is currently selected
            allEncounters[idsOfEncountersToBeAdded[i]][1].routesSelected = true;
          }
          // refill the encounters-table, so that it only shows selected encounters
          fillEncountersTable(allEncounters);
        }

        // if the routeCheckbox is deselected ...
        else {
          // ... do not show the corresponding route in the map "indexMap" (by removing this route from the layerGroup "routesGroup")
          routesGroup.removeLayer(polylineRoutesLatLongArray[cb_id]);
          // set to false to indicate, that the route is currently not selected
          allRoutes[cb_id][1] = false;
          // get all ids of encounters which have to be removed
          let idsOfEncountersToBeRemoved = encountersToBeRemoved(cb_id);
          // remove the encounters
          for (let i = 0; i < idsOfEncountersToBeRemoved.length; i++) {
            encountersGroup.removeLayer(encountersLatLongArray[idsOfEncountersToBeRemoved[i]]);
            // set to false to indicate, that the encounter is currently not selected
            allEncounters[idsOfEncountersToBeRemoved[i]][1].routesSelected = false;
          }
          // refill the encounters-table, so that it only shows selected encounters
          fillEncountersTable(allEncounters);
        }
      }



      /**
      * This function returns all ids of encounters which have to be removed, because a route was deselected
      * @private
      * @author Paula Scharf
      * @param routeId           id of affected route
      * @returns {Array} result  ids of affected encounters
      */
      function encountersToBeRemoved(routeId) {

        console.log("calculate encounters to be removed");

        let result = [];

        for (let i = 0; i < allEncounters.length; i++) {
          let currentEncounter = allEncounters[i];
          // all encounters which belong to the deselected route have to be removed
          if(currentEncounter[1].search !== "searched for" && (currentEncounter[2].firstRoute === routeId || currentEncounter[2].secondRoute === routeId)) {
            result.push(i);
          }
        }
        return result;
      }


      /**
      * This function returns all ids of encounters which have to be added, because a route was reselected.
      * @private
      * @author Paula Scharf
      * @param routeId           id of affected route
      * @returns {Array} result  ids of affected encounters
      */
      function encountersToBeAdded(routeId) {

        let result = [];
        //
        for (let i = 0; i < allEncounters.length; i++) {
          // only routes which belong to the selected route and one other selected route have to be added
          if (allEncounters[i][2].firstRoute === routeId && allRoutes[allEncounters[i][2].secondRoute][1] &&
            (confirmActive ? (allEncounters[i][0].tookPlace === "yes") : true)) {
              result.push(i);
            }
            else if (allEncounters[i][2].secondRoute === routeId && allRoutes[allEncounters[i][2].firstRoute][1] &&
              (confirmActive ? (allEncounters[i][0].tookPlace === "yes") : true)) {
                result.push(i);
              }
            }
            return result;
          }


          /**
          * Show all routes that apply for the searched parameters and all their encounters.
          * @author Paula Scharf, matr.: 450 334
          * @param obj - the routeCheckbox-object for the search
          */
          function searchEncounters(madeBy, obj) {
            // if the routeCheckbox is checked then do the search
            if ($(obj).is(":checked")) {
              let searchInput = {
                name: "",
                user: "",
                animalName: "",
                studyID: ""
              };
              // read the search input depending on if the switch for searching user routes or the switch for animal routes
              // has been activated
              if (madeBy === "animal") {
                searchInput.animalName = document.getElementById("searchAnimalName").value;
                searchInput.studyID = document.getElementById("searchStudyID").value;

              } else {
                searchInput.name = document.getElementById("searchRouteName").value;
                searchInput.user =  document.getElementById("searchRouteUser").value;
              }
              // get the id of all routes to which the search applies for
              let routeIds = searchForRouteIds(searchInput);
              console.log(routeIds);
              for (let i = 0; i < allRoutes.length; i ++) {
                if (allRoutes[i][0].madeBy === madeBy) {
                  routesGroup.removeLayer(polylineRoutesLatLongArray[i]);
                  if (routeIds.includes(i)) {
                    polylineRoutesLatLongArray[i].setStyle({
                      color: '#ec1a9c'
                    });
                    routesGroup.addLayer(polylineRoutesLatLongArray[i]);
                    indexMap.fitBounds(polylineRoutesLatLongArray[i].getBounds());
                    document.getElementById("routeCheckbox" + i).checked = true;
                    allRoutes[i][1] = true;
                  } else {
                    document.getElementById("routeCheckbox" + i).checked = false;
                    allRoutes[i][1] = false;
                  }
                }
              }
              for (let i = 0; i < allEncounters.length; i++) {
                let currentEncounter = allEncounters[i];
                if (allRoutes[currentEncounter[2].firstRoute][0].madeBy === madeBy) {
                  if (routeIds.includes(currentEncounter[2].firstRoute)) {
                    allEncounters[i][1].routesSelected = true;
                    allEncounters[i][1].search = "searched for";
                  } else {
                    allEncounters[i][1].routesSelected = false;
                    allEncounters[i][1].search = "not searched for";
                  }
                }
                if (allRoutes[currentEncounter[2].secondRoute][0].madeBy === madeBy) {
                  if (routeIds.includes(currentEncounter[2].secondRoute)) {
                    allEncounters[i][1].routesSelected = true;
                    allEncounters[i][1].search = "searched for";
                  } else {
                    allEncounters[i][1].routesSelected = false;
                    allEncounters[i][1].search = "not searched for";
                  }
                }
              }
              showEncountersOnStartingPage();
              // if the routeCheckbox is unchecked then undo the search
            } else {
              // recolor all routes in red or orange
              for (let i = 0; i < polylineRoutesLatLongArray.length; i++) {
                if (allRoutes[i][0].madeBy === madeBy) {
                  let color = ((allRoutes[i][0].madeBy === "animal") ?
                  "#ec7e00" : "#ec0000")
                  polylineRoutesLatLongArray[i].setStyle({
                    color: color
                  });
                }
              }
              //
              for (let i = 0; i < allRoutes.length; i++) {
                if (allRoutes[i][0].madeBy === madeBy) {
                  if (!allRoutes[i][1]) {

                    let checkbox = document.getElementById("routeCheckbox" + i);
                    checkbox.checked = true;
                    //
                    let ev = document.createEvent('Event');
                    //
                    ev.initEvent('click', true, false);
                    //
                    checkbox.dispatchEvent(ev);
                  }
                }
              }

              // reset the attributes of the encounter, that indicate if it is selected or searched for
              for (let i = 0; i < allEncounters.length; i++) {
                let currentEncounter = allEncounters[i];
                if (allRoutes[currentEncounter[2].firstRoute][0].madeBy === madeBy && allRoutes[currentEncounter[2].firstRoute][0].madeBy === madeBy) {
                  allEncounters[i][1].search = "no search";
                  // if both routes of an encounter are selected then indicate that the encounter is selected
                  if (allRoutes[currentEncounter[2].firstRoute][1] && allRoutes[currentEncounter[2].secondRoute][1]) {
                    allEncounters[i][1].routesSelected = true;
                  } else {
                    allEncounters[i][1].routesSelected = false;
                  }
                }
              }
              // show indicated encounters on the starting page
              showEncountersOnStartingPage();
            }
          }


          /**
          * get the position of the searched for routes in the allRoutes-array
          * @author Paula Scharf, matr.: 450 334
          * @param {object} input - the search parameters
          * @returns {Array} result - an array of indices
          */
          function searchForRouteIds(input) {
            let result = [];
            //
            for (let i = 0; i < allRoutes.length; i++) {
              let currentRoute = allRoutes[i];
              console.log("input: ", input);
              console.log("current route: ", currentRoute[0]);
              if(((input.name === "") ? true: (currentRoute[0].name === input.name)) &&
              ((input.user === "") ? true: (currentRoute[0].creator === input.user)) &&
              ((input.animalName === "") ? true: (currentRoute[0].individualTaxonCanonicalName === input.animalName)) &&
              ((input.studyID === "") ? true: (currentRoute[0].study_id === input.studyID))) {
                result.push(i);
              }
            }
            return result;
          }
