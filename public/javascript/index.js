// jshint esversion: 8
// jshint maxerr: 1000

"use strict";  // JavaScript code is executed in "strict mode"

/**
* @desc final project, Geosoftware1, SoSe2019
* @author name: Katharina Poppinga, matr.: 450 146; name: Paula Scharf, matr.: 450 334
*/

// please put in your own tokens at 'token.js'


// ****************************** global variables *****************************

/**
* Global variable which contains all routes from the database routeDB. This variable is
* an array containing no, one or many arrays (one array for one route). Each of these
* inner arrays has the route-object at its first position and a boolean indicator, representing
* whether the route is currently displayed or not, at its second position.
* @type {Array}
*/
let allRoutes = [];


/**
* Global variable which contains all encounters from the database routeDB. This variable is
* an array containing no, one or many arrays (one array for one encounter). Each of these
* inner arrays has
* - the encounter-object at its first position and
* - at the second position an object containing the following attributes:
* a boolean indicating if the route is selected, a string indicating if there is a search active and wether this encounter is being searched for.
* - at the third position an object containing the array-IDs of the corresponding routes for the encounter
* @type {Array}
*/
let allEncounters = [];


/**
* Global variable that indicates if the checkbox for only showing confirmed encounters is checked.
* @type {Boolean}
*/
let confirmActive = false;


/**
* A Leaflet-map in which the routes and encounters are shown.
* @type {Map}
*/
let indexMap;


/**
* A leaflet-featureGroup for all routes.
* @type {featureGroup}
*/
let allRoutesGroup;


/**
* A leaflet-featureGroup for all encounters.
*
* @type {featureGroup}
*/
let allEncountersGroup;


/**
* An array for the routes which are shown in the map "indexMap".
* @type {Array}
*/
let polylineRoutes = [];


/**
* An array for the encounters which are shown in the map "indexMap".
* @type {Array}
*/
let circleEncounters = [];


// ********************************* functions *********************************

/**
* Sets up the "indexMap" with OpenStreetMap tiles on the main page and requests all routes out of the database.
* Calls functions for writing all requested routes in their global array and showing all routes
* that are saved in the global routes array on the main page (in map and tables).
* Besides, calls function for requesting all encounters and showing them on the
* main page (in table and in map).
*
* @author Katharina Poppinga, matr.: 450146
*/
function getAndShowData() {

  // create the initial map in the "indexMap"-div, the proper map extract will be set later
  indexMap = L.map('indexMap').setView([0, 0], 3);

  // OpenStreetMap tiles as a layer for the map "indexMap"
  let oSMLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  });

  // add the OpenStreetMap tile layer to the map "indexMap"
  oSMLayer.addTo(indexMap);

  // create a layerGroup for all routes, add this group to the existing map "indexMap"
  allRoutesGroup = L.featureGroup().addTo(indexMap);

  // create a layerGroup for all encounters, add this group to the existing map "indexMap"
  allEncountersGroup = L.featureGroup().addTo(indexMap);


  // ********** AJAX request for reading all routes out of the database **********
  $.ajax({
    // use a http GET request
    type: "GET",
    // URL to send the request to
    url: "/routes/readAll",
    // data type of the response
    dataType: "json",
    // timeout set to 10 seconds
    timeout: 10000
  })

  // if the request is done successfully, ...
  .done (function (response) {

    // ... give a notice on the console that the AJAX request for reading all routes has succeeded
    console.log("AJAX request (reading all routes) is done successfully.");

    // ... write all requested routes in their global array
    writeAllRoutesInTheGlobalArray(response);

    // ... show all routes on the main page (in table and in map)
    showAllRoutesOnMainPage();

    // ... request all encounters and show them on the main page (in table and in map)
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
* This function takes the response of the AJAX-request for getting all routes and writes it into to global array "allRoutes".
* @author Paula Scharf, matr.: 450334
* @param response - response of the ajax-request for getting all routes
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


/**
* Writes all routes which are saved in the global routes array into their tables on main page and shows
* them on the main map "indexMap". Adds a checkbox for showing the route in the map or not and
* a button for deleting each route to each table row. In addition, for each user route a button for
* updating is added.
*
* @private
* @author Katharina Poppinga, matr.: 450146
*/
function showAllRoutesOnMainPage() {

  fillRoutesTable();
  fillRoutesMap();
}

/**
 * This function fills both route-tables on the main page with all the routes in the allRoutes-Array
 * @private
 * @author Katharina Poppinga, matr.: 450146; Paula Scharf, matr.: 450334
 */
function fillRoutesTable() {
  // clear the tables
  deleteAllChildrenOfElement("routesTable");
  deleteAllChildrenOfElement("animalRoutesTable");

  // loop "over" all routes in the current database "routeDB"
  for (let i = 0; i < allRoutes.length; i++) {

    let currentRoute = allRoutes[i];

    // if the route is a user route ...
    if (currentRoute[0].madeBy === "user") {
      // ... show it with a consecutive number and its creator, name, date, time and type in the table "routesTable" on the main page
      createUserRouteTable(i, currentRoute[0].creator, currentRoute[0].name, currentRoute[0].date, currentRoute[0].time, currentRoute[0].type, "routesTable");
    }

    // if the route is an animal route ...
    else {
      // ... show it with a consecutive number and its studyID, individualTaxonCanonicalName, date and time in the table "animalRoutesTable" on the main page
      createAnimalRouteTable(i, currentRoute[0].study_id, currentRoute[0].individualTaxonCanonicalName, currentRoute[0].date, currentRoute[0].time, "animalRoutesTable");
    }

    // outsource the creation of the checkbox for showing or not showing the i-th route in the map
    routeCheckbox(i, currentRoute[1]);

    // if the route is a user route ...
    if (currentRoute[0].madeBy === "user") {
      // .. add a button for updating it to the routes-table
      updateButton(i);
    }

    // add a button for deleting the i-th route to its corresponding table
    deleteButton(i);
  }
}

/**
 * This function fills the map on the main page with all the routes in the allRoutes-Array
 * @private
 * @author Katharina Poppinga, matr.: 450146; Paula Scharf, matr.: 450334
 */
function fillRoutesMap() {
  // coordinates of a route (in GeoJSONs long-lat order)
  let coordinatesRoute;
  // loop "over" all routes in the current database "routeDB"
  for (let i = 0; i < allRoutes.length; i++) {

    let currentRoute = allRoutes[i];

    // ************** show the i-th route in the map "indexMap" on the main page, therefore do the following steps: **************

    // TODO: ATTRIBUT UMBENENNEN, DA ES KEIN GEOJSON IST

    // extract the coordinates of the i-th route
    coordinatesRoute = currentRoute[0].geoJson.features[0].geometry.coordinates;

    // if the current route is a user route, color it red, otherwise orange
    let color = ((currentRoute[0].madeBy === "user") ? '#ec0000' : '#ec7e00');
    // make a leaflet-polyline from the coordinatesRoute and show this polyline in the map
    let polylineOfRoute = L.polyline(coordinatesRoute, {color: color}, {weight: '3'});

    // if the current route is a user route ...
    if (currentRoute[0].madeBy === "user") {
      // ... add a popup to it in the map, telling its name, its creator and that it is a user route
      polylineOfRoute.bindPopup("Route number " + (i + 1) + " has the name '" + currentRoute[0].name + "' and was created by a user with the name '" + currentRoute[0].creator + "'");

      // if the current route is an animal route ...
    } else {
      // ... add a popup to it in the map, telling the taxon of its animal, its studyID and that it is an animal route
      polylineOfRoute.bindPopup("Route number " + (i + 1) + " was made by an animal with the taxon '" + currentRoute[0].individualTaxonCanonicalName + "' from the study with the ID " + currentRoute[0].study_id);
    }

    // add the polyline to the array polylineRoutes for being able to address the polylines(routes) by numbers (kind of IDs) (needed for checkboxes)
    polylineRoutes.push(polylineOfRoute);


    // TODO: KOMMENTARE ANPASSEN!!!
    if (currentRoute[1]) {
      // add the i-th polyline-element of the array polylineRoutes to the allRoutesGroup and therefore to the map "indexMap"
      polylineRoutes[i].addTo(allRoutesGroup);
      // for the first route of the database ...
      if (i === allRoutes.length - 1) {
        // ... center the map on the first point of the first route
        indexMap.fitBounds(allRoutesGroup.getBounds());
      }
    }
  }
}


/**
* This function retrieves all encounters from the database and displays them on the map and the table.
* Also if a route is deleted, added or updated the encounters in the database are also adjusted with this function.
* @author Paula Scharf, matr.: 450334
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
    // timeout set to 20 seconds
    timeout: 20000
  })

  // if the request is done successfully, ...
  .done (function (response) {

    writeAllEncountersInTheGlobalArray(response);

    // check if a route was added or updated and adjust the encounters accordingly
    checkForNewRoute(allRoutes, true);

    showEncountersOnMainPage();

    // ... give a notice on the console that the AJAX request for reading all encounters has succeeded
    console.log("AJAX request (reading all encounters) is done successfully.");
  })

  // if the request has failed, ...
  .fail (function (xhr, status, error) {
    // ... give a notice that the AJAX request for reading all routes has failed and show the error on the console
    console.log("AJAX request (reading all encounters) has failed.", error);

    // TODO: ÜBERPRÜFEN, OB SCHREIBWEISE RICHTIG
    if (error === "timeout") {
      JL("ajaxReadingAllEncountersTimeout").fatalException("ajax: '/encounter/readAll' timeout");
    }
  });
}


/**
* This function takes the response of the AJAX-request for getting all encounters and writes it into to global array "allEncounters".
* @author Paula Scharf, matr.: 450334
* @param response - response of the ajax-request for getting all encounters
*/
function writeAllEncountersInTheGlobalArray(response) {

  response.forEach((currentEncounter) => {
    //
    let noOfRoutes = {firstRoute: undefined, secondRoute: undefined};
    // go through all routes, to determine their index in the allRoutes-array and give that information
    // to the encounter
    for (let k = 0; k < allRoutes.length; k++) {
      let currentRoute = allRoutes[k];
      if (currentRoute[0]._id === currentEncounter.firstRoute) {
        noOfRoutes.firstRoute = k;
      }
      //
      else if (currentRoute[0]._id === currentEncounter.secondRoute) {
        noOfRoutes.secondRoute = k;
      }
    }
    // if the attributes "firstRoute" and "secondRoute" both contain values
    if (noOfRoutes.firstRoute !== "undefined" && noOfRoutes.secondRoute !== "undefined") {
      let parameters = {
        routesSelected: true,
        search: "no search"
      };
      // give true as the second argument to indicate that all corresponding routes for this encounter are selected
      // give true as the fourth argument to indicate that ther is either no search active or this encounter is
      // currently being searched for
      allEncounters.push([currentEncounter, parameters, noOfRoutes]);
      // if the "firstRoute" or "secondRoute" is undefined
    } else {
      // delete the current encounter from the db if any of the corresponding routes are missing
      deleteEncounter(currentEncounter._id);
    }

    // ************************************************************************************************************

    // check if a route was added or updated and adjust the encounters accordingly
    checkForNewRoute(allRoutes, true);

    showEncountersOnMainPage();
  });
}


/**
* This function displays all encounters in the map and in the table after they have been retrieved from the database.
* @private
* @author Paula Scharf, matr.: 450334
*/
function showEncountersOnMainPage() {
  // fill the table for the encounters with the encounters-array
  fillEncountersTable();
  fillEncountersMap();
}


/**
* This function fills the table for the encounters with all encounters that are selected or searched for.
* If the global variable "confirmActive" is set to true, it also only shows confirmed encounters.
* @private
* @author Paula Scharf, matr.: 450334
*/
function fillEncountersTable() {
  // clear the table
  deleteAllChildrenOfElement("encountersTable");
  // fill the table
  for (let i = 0; i < allEncounters.length; i++) {
    let currentEncounter = allEncounters[i];
    if (typeof allRoutes[currentEncounter[2].firstRoute] !== "undefined" && typeof allRoutes[currentEncounter[2].secondRoute] !== "undefined") {
      // only show encounters, which are also shown on the map
      if (currentEncounter[1].routesSelected &&
        (currentEncounter[1].search === "no search" || currentEncounter[1].search === "searched for") &&
        // if the "show confirmed" checkbox is active then check if the encounter is confirmed/ took place.
        // if the checkbox is not active then give true regardless
        (confirmActive ? (currentEncounter[0].tookPlace === "yes") : true)) {
          createEncountersTable(i, currentEncounter[2].firstRoute + 1, currentEncounter[2].secondRoute + 1, "encountersTable");
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
      else {
        deleteEncounter(currentEncounter[0]._id);
        allEncounters.splice(i, 1);
      }
    }
  }


  /**
  * This function fills the map with all encounters that are selected or searched for.
  * If the global variable "confirmActive" is set to true, it also only shows confirmed encounters.
  * @private
  * @author Paula Scharf, matr.: 450334
  */
  function fillEncountersMap() {

    allEncountersGroup.eachLayer(function (layer) {
      allEncountersGroup.removeLayer(layer);
    });

    circleEncounters = [];
    // loop "over" all encounters in the current database "routeDB"
    for (let i = 0; i < allEncounters.length; i++) {
      let currentEncounter = allEncounters[i];
      // if the encounter took place color it green, otherwise blue
      let color = (currentEncounter[0].tookPlace === "yes") ? "#009d42" : "#000bec";

      // make a circle out of the current encounter
      let currentCircle = L.circle([currentEncounter[0].intersectionX, currentEncounter[0].intersectionY],
        {radius: 200, color: color, fillColor: color, fillOpacity: 0.5});
        let agent_1 = ((allRoutes[currentEncounter[2].firstRoute][0].madeBy === "animal") ?
        allRoutes[currentEncounter[2].firstRoute][0].individualTaxonCanonicalName : allRoutes[currentEncounter[2].firstRoute][0].creator);
        let agent_2 = ((allRoutes[currentEncounter[2].secondRoute][0].madeBy === "animal") ?
        allRoutes[currentEncounter[2].secondRoute][0].individualTaxonCanonicalName : allRoutes[currentEncounter[2].secondRoute][0].creator);
        currentCircle.bindPopup("encounter number " + (i + 1) + " between " + agent_1 + " and " + agent_2);
        // add the circle to the array circleEncounters
        circleEncounters.push(currentCircle);
        if(currentEncounter[1].routesSelected &&
          (currentEncounter[1].search === "no search" || currentEncounter[1].search === "searched for") &&
          // if the "show confirmed" checkbox is active then check if the encounter is confirmed/ took place.
          // if the checkbox is not active then give true regardless
          (confirmActive ? (currentEncounter[0].tookPlace === "yes") : true)) {
            // add the circleEncounters to the allEncountersGroup
            circleEncounters[i].addTo(allEncountersGroup);
          }
        }
      }


      /**
      * Creates a checkbox for a route inside its corresponding table cell.
      * A selected/checked checkbox adds its corresponding route to the "allRoutesGroup", therefore this route is shown in the map "indexMap".
      * A deselected checkbox removes its corresponding route from the "allRoutesGroup", therefore this route is not shown in the map "indexMap".
      *
      * @private
      * @author Katharina Poppinga, matr.: 450146
      * @param {number} i - part of the ID for the checkbox
      * @param {boolean} checked - indicate if a route is selected
      */
      function routeCheckbox(i, checked){

        // label the table cell, in which the checkbox for the route will be written, as "tableCellCheckbox"
        let tableCellCheckbox = document.getElementById("conseNum"+i);

        // add the checkbox for the route (which calls the function routeSelectionForMap(cb_id) if clicked) to the content of the "tableCellCheckbox"
        tableCellCheckbox.innerHTML = tableCellCheckbox.innerHTML + " <input type='checkbox' id='routeCheckbox" + i + "' checked onclick='routeSelectionForMap(" + i + ")' style='margin-left: 10px; margin-right: 15px;'>";

        document.getElementById("routeCheckbox" + i).checked = checked;
      }


      /**
      * Creates a button for deleting its corresponding route inside the routes' table cell.
      * Submitting the button calls '/routes/delete'.
      *
      * @private
      * @author Katharina Poppinga, matr.: 450146
      * @param {number} i - part of the ID for the delete-button
      */
      function deleteButton(i){

        // label the table cell, in which the delete-button will be written, as "tableCellDeleteButton"
        let tableCellDeleteButton = document.getElementById("conseNum"+i);

        let id = allRoutes[i][0]._id;
        //
        tableCellDeleteButton.innerHTML = tableCellDeleteButton.innerHTML + "<button id='deleteButton" + i + "' onclick='deleteRoute(\"" + id +"\")' style='margin-left:15px'>delete</button>";
      }

/**
 * This function deletes a route from the database and the main page.
 * Also deletes all encounters with that route from the database and the main page
 * @private
 * @author Paula Scharf, matr.: 450334
 * @param id {String} - the id of the route in the database
 */
function deleteRoute(id) {
  $.ajax({
    // use a http GET request
    type: "GET",
    // URL to send the request to
    url: "/routes/delete",
    // data to send to the server
    data: {
      _id: id
    },
    // timeout set to 10 seconds
    timeout: 10000
  })

  // if the request is done successfully, ...
      .done (function () {
        // ... give a notice on the console that the AJAX request for pushing an encounter has succeeded
        console.log("AJAX request (deleting a route) is done successfully.");

        for (let i = 0; i < allRoutes.length; i++) {
          let currentRoute = allRoutes[i];
          if (currentRoute[0]._id === id) {
            allRoutes.splice(i,1);
            allRoutesGroup.removeLayer(polylineRoutes[i]);
            polylineRoutes.splice(i,1);
            i = i-1;
          }
        }
        fillRoutesTable();
        deleteAllEncountersOfRoute(id);
        showEncountersOnMainPage();
      })

      // if the request has failed, ...
      .fail(function (xhr, status, error) {
        // ... give a notice that the AJAX request for deleting an encounter has failed and show the error on the console
        console.log("AJAX request (deleting a route) has failed.", error);

        // TODO: ÜBERPRÜFEN, OB SCHREIBWEISE RICHTIG
        if (error === "timeout") {
          JL("ajaxDeletingEncounterTimeout").fatalException("ajax: '/routes/delete' timeout");
        }
      });
}


      /**
      * Creates a button for updating its corresponding user route inside the user routes' table cell.
      * Submitting the button calls '/userroute'.
      *
      * @private
      * @author Katharina Poppinga, matr.: 450146
      * @param {number} i - part of the ID for the update-button
      */
      function updateButton(i){

        // label the table cell, in which the update-button will be written, as "tableCellUpdateButton"
        let tableCellUpdateButton = document.getElementById("conseNum"+i);

        let id = allRoutes[i][0]._id;

        /// add the button for updating the user route (which calls '/userroute') to the content of the "tableCellUpdateButton"
        tableCellUpdateButton.innerHTML = tableCellUpdateButton.innerHTML + " <form action='/userroute' method='GET' name='updateButtonForm' style='display: inline;'>" +
        "<input type='hidden' name='_id' value='" + id +"'/>" +
        "<input type='submit' value='update' id='updateButton" + i + "'/>" +
        "</form>";
      }


      /**
      * This function creates the button for sharing an encounter in the encounters-table.
      * Submitting the button calls '/getSingleEncounter'.
      * @private
      * @author Paula Scharf, matr.: 450334
      * @param {number} bt_id - number of row
      */
      function shareButton(bt_id) {

        // label the table cell, in which the share-button will be written, as "tableCellButton"
        let tableCellButton = document.getElementById("share"+bt_id);

        if(tableCellButton) {
          let ids = {
            e_id: allEncounters[bt_id][0]._id,
            r1_id: allRoutes[allEncounters[bt_id][2].firstRoute][0]._id,
            r2_id: allRoutes[allEncounters[bt_id][2].secondRoute][0]._id,
          };

          // add the share-button (which calls '/getSingleEncounter') to the content of the "tableCellButton"
          tableCellButton.innerHTML = "<form action='/getSingleEncounter' method='GET' name='shareForm'>" +
          "<input type='hidden' name='e_id' value='" + ids.e_id + "'/>" +
          "<input type='hidden' name='r1_id' value='" + ids.r1_id + "'/>" +
          "<input type='hidden' name='r2_id' value='" + ids.r2_id + "'/>" +
          "<input type='submit' value='share' id='sharebutton" + bt_id + "'/>" +
          "</form>";
        }
      }


      /**
      * This function creates the checkbox for confirming an encounter in the encounters-table.
      * @private
      * @author Paula Scharf, matr.: 450334
      * @param {number} cb_id - number of row
      * @param {boolean} disabled - boolean indicating if the checkbox is supposed to be disabled
      */
      function encounterCheckbox(cb_id, disabled) {

        let currentEncounter = allEncounters[cb_id][0];

        // label the table cell, in which the checkbox will be written, as "tableCellCheckbox"
        let tableCellCheckbox = document.getElementById("confirm"+cb_id);
        // add a checkbox (which calls the function encounterConfirm(cb_id) if clicked) to the content of the "tableCellCheckbox"
        tableCellCheckbox.innerHTML = tableCellCheckbox.innerHTML + " <input type='checkbox' id='encounterCheckbox" +cb_id+ "' onclick='encounterConfirm("+cb_id+")'>";
        // if the encounter was already confirmed, the checkbox is checked
        document.getElementById("encounterCheckbox" + cb_id).checked = (currentEncounter.tookPlace === "yes");
        // if both routes of an encounter are completed, the checkbox is enabled, otherwise disabled
        document.getElementById("encounterCheckbox" + cb_id).disabled = disabled;
      }


      /**
      * This function changes the attribute "tookPlace" of an encounter if the "confirm encounter"-checkbox is checked.
      * It also rewrites all the encounters in the map to change their color accordingly.
      * @private
      * @author Paula Scharf, matr.: 450334
      * @param {number} cb_id - number of row or number of encounter in the global array
      */
      function encounterConfirm(cb_id) {
        let checkbox = document.getElementById("encounterCheckbox" + cb_id);
        let currentEncounter = allEncounters[cb_id][0];

        // if the encounter is confirmed by checking the checkbox the attribute tookPlace is set to "yes", otherwise "maybe"
        let tookPlace = (checkbox.checked === true ? "yes" : "maybe");

        let encounter = {
          _id: currentEncounter._id,
          tookPlace: tookPlace
        };

        allEncounters[cb_id][0].tookPlace = tookPlace;

        updateEncounter(encounter);
        fillEncountersMap();
      }

/**
 * This function comes into play when the "show confirmed" checkbox is being checked.
 * It makes sure that only the confirmed encounters are being shown in the map and in the table.
 * @private
 * @author Paula Scharf, matr.: 450334
 */
function onlyShowConfirmed() {

  let checkbox = document.getElementById("showConfirmedCheckbox");
  //
  if (checkbox.checked === true) {
    confirmActive = true;
    showEncountersOnMainPage();
  } else {
    confirmActive = false;
    showEncountersOnMainPage();
  }
}

/**
      * This function makes an AJAX-request in order to update an encounter in the database.
      * @private
      * @author Paula Scharf, matr.: 450334
      * @param encounter
      */
      function updateEncounter(encounter) {

        $.ajax({
          // use a http POST request
          type: "POST",
          // URL to send the request to
          url: "/encounter/update",
          //
          data: JSON.stringify(encounter),
          // type of the data that is sent to the server
          contentType: "application/json; charset=utf-8",
          // timeout set to 10 seconds
          timeout: 10000
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
            JL("ajaxUpdatingEncounterTimeout").fatalException("ajax: '/encounter/update' timeout");
          }
        });
      }


      /**
      * Checks whether a route-checkbox with given ID is checked (picked) or not (deselected) for customizing the shown
      * routes in the map "indexMap". If the routeCheckbox is checked (picked), the corresponding route is added
      * to the allRoutesGroup (global variable) and therefore shown in the map "indexMap".
      *
      * @private
      * @author Katharina Poppinga, matr.: 450146, Paula Scharf, matr.: 450334
      * @param {number} cb_id - ID of the route-checkbox
      */
      function routeSelectionForMap(cb_id){

        // label the route-checkbox
        let checkBox = document.getElementById("routeCheckbox" + cb_id);

        // if the route-checkbox is checked ...
        if (checkBox.checked) {
          // ... show the corresponding route in the map "indexMap" (by adding this route to the layerGroup "allRoutesGroup")
          allRoutesGroup.addLayer(polylineRoutes[cb_id]);
          // ... set to true to indicate that the route is currently selected
          allRoutes[cb_id][1] = true;
          // ... get all IDs of encounters which have to be added
          let idsOfEncountersToBeAdded = encountersToBeAdded(cb_id);

          // ... add the encounters
          for (let i = 0; i < idsOfEncountersToBeAdded.length; i++) {
            let currentId = idsOfEncountersToBeAdded[i];
            allEncountersGroup.addLayer(circleEncounters[currentId]);
            // set to true to indicate that the route is currently selected
            allEncounters[currentId][1].routesSelected = true;
          }
          // ... refill the encounters-table, so that it only shows selected encounters
          fillEncountersTable(allEncounters);
        }

        // if the route-checkbox is deselected ...
        else {
          // ... do not show the corresponding route in the map "indexMap" (by removing this route from the layerGroup "allRoutesGroup")
          allRoutesGroup.removeLayer(polylineRoutes[cb_id]);
          // ... set to false to indicate that the route is currently not selected
          allRoutes[cb_id][1] = false;
          // ... get all IDs of encounters which have to be removed
          let idsOfEncountersToBeRemoved = encountersToBeRemoved(cb_id);
          // ... remove the encounters
          idsOfEncountersToBeRemoved.forEach((currentId) => {
            allEncountersGroup.removeLayer(circleEncounters[currentId]);
            // set to false to indicate that the encounter is currently not selected
            allEncounters[currentId][1].routesSelected = false;
          });
          // ... refill the encounters-table, so that it only shows selected encounters
          fillEncountersTable(allEncounters);
        }
      }


      /**
      * This function returns all IDs of encounters which have to be removed because a route was deselected.
      * @private
      * @author Paula Scharf, matr.: 450334
      * @param routeId           id of affected route
      * @returns {Array} result  ids of affected encounters
      */
      function encountersToBeRemoved(routeId) {

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
      * This function returns all IDs of encounters which have to be added because a route was reselected.
      * @private
      * @author Paula Scharf, matr.: 450334
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
          * @author Paula Scharf, matr.: 450334
          * @param {String} madeBy - a string indicating wether a user or an animal has created the route
          * @param searchCheckbox - the routeCheckbox-object for the search
          */
          function searchEncounters(madeBy, searchCheckbox) {
            // if the routeCheckbox is checked then do the search
            if ($(searchCheckbox).is(":checked")) {
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
              for (let i = 0; i < allRoutes.length; i ++) {
                if (allRoutes[i][0].madeBy === madeBy) {
                  allRoutesGroup.removeLayer(polylineRoutes[i]);
                  if (routeIds.includes(i)) {
                    polylineRoutes[i].setStyle({
                      color: '#ec1a9c'
                    });
                    allRoutesGroup.addLayer(polylineRoutes[i]);
                    indexMap.fitBounds(polylineRoutes[i].getBounds());
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
              showEncountersOnMainPage();
              // if the routeCheckbox is unchecked then undo the search
            } else {
              // recolor all routes in red or orange
              for (let i = 0; i < polylineRoutes.length; i++) {
                if (allRoutes[i][0].madeBy === madeBy) {
                  // if the route is made by an animal color it orange, otherwise red
                  let color = ((allRoutes[i][0].madeBy === "animal") ?
                  "#ec7e00" : "#ec0000");
                  polylineRoutes[i].setStyle({
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
                    ev.initEvent('click', true, false);
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
                  allEncounters[i][1].routesSelected = (allRoutes[currentEncounter[2].firstRoute][1] &&
                    allRoutes[currentEncounter[2].secondRoute][1]);
                  }
                }
                // show indicated encounters on the main page
                showEncountersOnMainPage();
              }
            }


            /**
            * Gets the position of the searched for routes in the allRoutes-array.
            * @author Paula Scharf, matr.: 450334
            * @param {object} input - the search parameters
            * @returns {Array} result - an array of indices
            */
            function searchForRouteIds(input) {
              let result = [];
              //
              for (let i = 0; i < allRoutes.length; i++) {
                let currentRoute = allRoutes[i];
                // only check the attributes that have a value in the search form
                if(((input.name === "") ? true: (currentRoute[0].name == input.name)) &&
                ((input.user === "") ? true: (currentRoute[0].creator == input.user)) &&
                ((input.animalName === "") ? true: (currentRoute[0].individualTaxonCanonicalName == input.animalName)) &&
                ((input.studyID === "") ? true: (currentRoute[0].study_id == input.studyID))) {
                  result.push(i);
                }
              }
              return result;
            }
