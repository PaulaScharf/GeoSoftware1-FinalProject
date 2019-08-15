// jshint esversion: 8
// jshint maxerr: 1000

"use strict";  // JavaScript code is executed in "strict mode"

/**
 * @desc final project, Geosoftware1, SoSe2019
 * @author name: Katharina Poppinga, matr.: 450 146; name: Paula Scharf, matr.: 450 334
 */

// please put in your own tokens at 'token.js'



// TODO: KOMMENTARE (u.a. IN CHECKBOX-FUNKTIONEN) an consecutive nr mit 1 beginnend ANPASSEN


// ****************************** global variables ******************************

/**
 * Global variable which contains all routes from the database routeDB. This variable is
 * an array containing no, one or many arrays (one array for one route). Each of these
 * inner arrays has the route-object at its first position and a boolean indicator, representing
 * whether the route is currently displayed or not, at its second position.
 * @type {Array} allRoutes
 */
let allRoutes = [];

/**
 * Global variable which contains all encounters from the database routeDB. This variable is
 * an array containing no, one or many arrays (one array for one encounter). Each of these
 * inner arrays has
 * the encounter-object at its first position and then at the second position an object containing the following attributes:
 * a boolean indicating if the route is selected,
 * a string indicating if there is a search active and wether this encounter is being searched for.
 * At the third position an object containing the array-ids of the corresponding routes for the encounter.
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



/**
 * array for the routes which are shown in the map "indexMap"
 * @type {Array}
 */
let polylineRoutes = [];


/**
 * array for the encounters which are shown in the map "indexMap"
 * @type {Array}
 */
let circleEncounters = [];


JL("ajaxReadingAllRoutesTimeout").fatalException("ajax: '/routes/readAll' timeout");
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
    // timeout set to 7 seconds
    timeout: 7000
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


// JSDOC ANPASSEN!!!
/**
 * Writes routes into table and shows routes in map (both on starting page) ............
 *
 * @private
 * @author Katharina Poppinga 450146
 */
function showAllRoutesOnStartingPage() {

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

    // if the current route is a userroute, color it red, otherwise orange
    let color = ((currentRoute[0].madeBy === "user") ? '#ec0000' : '#ec7e00');
    // make a leaflet-polyline from the coordinatesRoute and show this polyline in the map
    let polylineOfRoute = L.polyline(coordinatesRoute, {color: color}, {weight: '3'});

    if (currentRoute[0].madeBy === "user") {
      polylineOfRoute.bindPopup("route number " + (i + 1) + " has the name " + currentRoute[0].name
          + " and was made by a user with the name " + currentRoute[0].creator);
    } else {
      polylineOfRoute.bindPopup("route number " + (i + 1) + " was made by an animal with the name "
          + currentRoute[0].individualTaxonCanonicalName + " from the study with the id " + currentRoute[0].study_id);
    }
    // add the polyline to the array polylineRoutes for being able to address the polylines(routes) by numbers (kind of IDs) (needed for checkboxes)
    polylineRoutes.push(polylineOfRoute);

    if (currentRoute[1]) {
      // add the i-th polyline-element of the array polylineRoutes to the routesGroup and therefore to the map "indexMap"
      polylineRoutes[i].addTo(routesGroup);
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
    // timeout set to 7 seconds
    timeout: 7000
  })

  // if the request is done successfully, ...
      .done (function (response) {

        writeAllEncountersInTheGlobalArray(response);

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

/**
 * This function takes the response of the ajax-call for getting all encounters and writes it into to global array "allEncounters"
 * @author  Paula Scharf 450334
 * @param response - response of the ajax-call for getting all encounters
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

      //console.log(allEncounters);

      showEncountersOnStartingPage();

      // ... give a notice on the console that the AJAX request for reading all encounters has succeeded
      console.log("AJAX request (reading all encounters) is done successfully.");
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
        // if the "show confirmed" checkbox is active then check if the encounter is confirmed/ took place.
        // if the checkbox is not active then give true regardless
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
      // add the circleEncounters to the encountersGroup
      circleEncounters[i].addTo(encountersGroup);
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

  if(tableCellButton) {
    let ids = {
      e_id: allEncounters[bt_id][0]._id,
      r1_id: allRoutes[allEncounters[bt_id][2].firstRoute][0]._id,
      r2_id: allRoutes[allEncounters[bt_id][2].secondRoute][0]._id,
    };


    // add a button (which calls the function routeSelectionForMap(bt_id) if clicked) to the content of the "tableCellCheckbox"
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
 * @author Paula Scharf 450334
 * @param {number} cb_id - number of row
 * @param {boolean} disabled - boolean indicating if the checkbox is supposed to be disabled
 */
function encounterCheckbox(cb_id, disabled) {
  let currentEncounter = allEncounters[cb_id][0];
  // label the table cell, in which the routeCheckbox will be written, as "tableCellCheckbox"
  let tableCellCheckbox = document.getElementById("confirm"+cb_id);
  // add a routeCheckbox (which calls the function routeSelectionForMap(cb_id) if clicked) to the content of the "tableCellCheckbox"
  tableCellCheckbox.innerHTML = tableCellCheckbox.innerHTML + " <input type='checkbox' id='encounterCheckbox" +cb_id+ "' onclick='encounterConfirm("+cb_id+")'>";
  // if the encounter was already confirmed the checkbox is checked
  document.getElementById("encounterCheckbox" + cb_id).checked = (currentEncounter.tookPlace === "yes");
  // if booth routes of an encounter are completed the checkbox is enabled, otherwise disabled
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
    // timeout set to 7 seconds
    timeout: 7000
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
 * polylineRoutes (global variable) as the ID of the routeCheckbox) is added to the routesGroup (global variable) and therefore shown in the map "indexMap".
 *
 * @private
 * @author Katharina Poppinga 450146, Paula Scharf 450334
 * @param {number} cb_id - ID of the routeCheckbox
 */
function routeSelectionForMap(cb_id){

  // label the routeCheckbox
  let checkBox = document.getElementById("routeCheckbox" + cb_id);

  // if the routeCheckbox is checkbox ...
  if (checkBox.checked){
    // ... show the corresponding route in the map "indexMap" (by adding this route to the layerGroup "routesGroup")
    routesGroup.addLayer(polylineRoutes[cb_id]);
    // set to true to indicate, that the route is currently selected
    allRoutes[cb_id][1] = true;
    // get all ids of encounters which have to be added
    let idsOfEncountersToBeAdded = encountersToBeAdded(cb_id);

    // add the encounters
    for (let i = 0; i < idsOfEncountersToBeAdded.length; i++) {
      let currentId = idsOfEncountersToBeAdded[i];
      encountersGroup.addLayer(circleEncounters[currentId]);
      // set to true to indicate, that the route is currently selected
      allEncounters[currentId][1].routesSelected = true;
    }
    // refill the encounters-table, so that it only shows selected encounters
    fillEncountersTable(allEncounters);
  }

  // if the routeCheckbox is deselected ...
  else {
    // ... do not show the corresponding route in the map "indexMap" (by removing this route from the layerGroup "routesGroup")
    routesGroup.removeLayer(polylineRoutes[cb_id]);
    // set to false to indicate, that the route is currently not selected
    allRoutes[cb_id][1] = false;
    // get all ids of encounters which have to be removed
    let idsOfEncountersToBeRemoved = encountersToBeRemoved(cb_id);
    // remove the encounters
    idsOfEncountersToBeRemoved.forEach((currentId) => {
      encountersGroup.removeLayer(circleEncounters[currentId]);
      // set to false to indicate, that the encounter is currently not selected
      allEncounters[currentId][1].routesSelected = false;
    });
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
      console.log(searchInput.studyID);
    } else {
      searchInput.name = document.getElementById("searchRouteName").value;
      searchInput.user =  document.getElementById("searchRouteUser").value;
    }
    // get the id of all routes to which the search applies for
    let routeIds = searchForRouteIds(searchInput);
    for (let i = 0; i < allRoutes.length; i ++) {
      if (allRoutes[i][0].madeBy === madeBy) {
        routesGroup.removeLayer(polylineRoutes[i]);
        if (routeIds.includes(i)) {
          polylineRoutes[i].setStyle({
            color: '#ec1a9c'
          });
          routesGroup.addLayer(polylineRoutes[i]);
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
    showEncountersOnStartingPage();
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
        allEncounters[i][1].routesSelected = (allRoutes[currentEncounter[2].firstRoute][1] &&
            allRoutes[currentEncounter[2].secondRoute][1]);
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
