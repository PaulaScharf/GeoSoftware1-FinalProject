// jshint esversion: 6
// jshint maxerr: 1000

"use strict";  // JavaScript code is executed in "strict mode"

/**
* @desc final project, Geosoftware1, SoSe2019
* @author name: Katharina Poppinga, matr.: 450 146; name: Paula Scharf, matr.: 450 334
*/


// TODO: APPEND-TEIL DER FUNKTIONEN AUFTEILEN (AUSLAGERN)


/**
* Creates new table row with six new table cells and appends the row and these cells to given table.
* The first created cell is given an ID for a consecutive number of the routes.
* In addition, this function writes the given values (first: +1) in given order into the created table cells.
*
* @private
* @author Katharina Poppinga 450146
* @param insertFirst - first value, to write in first new created cell
* @param insertSecond - second value, to write in second new created cell
* @param insertThird - third value, to write in third new created cell
* @param insertFourth - fourth value, to write in fourth new created cell
* @param insertFifth - fifth value, to write in fifth new created cell
* @param insertSixth - sixth value, to write in sixth new created cell
* @param {string} tableBodyID - ID of the tbody to which to append the new created row and cells
*/
function createUserRouteTable(insertFirst, insertSecond, insertThird, insertFourth, insertFifth, insertSixth, tableBodyID){

  // create new table row and six new table cells and write corresponding values into them
  let row = document.createElement("tr");
  let firstValue = document.createElement("td");
  firstValue.id = "conseNum" + insertFirst;
  firstValue.innerHTML = insertFirst + 1;
  firstValue.style.cssText = 'text-align: center;';
  let secondValue = document.createElement("td");
  secondValue.innerHTML = insertSecond;
  let thirdValue = document.createElement("td");
  thirdValue.innerHTML = insertThird;
  let fourthValue = document.createElement("td");
  fourthValue.innerHTML = insertFourth;
  let fifthValue = document.createElement("td");
  fifthValue.innerHTML = insertFifth;
  let sixthValue = document.createElement("td");
  sixthValue.innerHTML = insertSixth;

  // append new row and six new cells to given table
  document.getElementById(tableBodyID).appendChild(row);
  row.appendChild(firstValue);
  row.appendChild(secondValue);
  row.appendChild(thirdValue);
  row.appendChild(fourthValue);
  row.appendChild(fifthValue);
  row.appendChild(sixthValue);
}


/**
* Creates new table row with five new table cells and appends the row and these cells to given table.
* The first created cell is given an ID for a consecutive number of the routes.
* In addition, this function writes the given values (first: +1) in given order into the created table cells.
*
* @private
* @author Katharina Poppinga 450146
* @param insertFirst - first value, to write in first new created cell
* @param insertSecond - second value, to write in second new created cell
* @param insertThird - third value, to write in third new created cell
* @param insertFourth - fourth value, to write in fourth new created cell
* @param insertFifth - fifth value, to write in fifth new created cell
* @param {string} tableBodyID - ID of the tbody to which to append the new created row and cells
*/
function createAnimalRouteTable(insertFirst, insertSecond, insertThird, insertFourth, insertFifth, tableBodyID){

  // create new table row and five new table cells and write corresponding values into them
  let row = document.createElement("tr");
  let firstValue = document.createElement("td");
  firstValue.id = "conseNum" + insertFirst;
  firstValue.innerHTML = insertFirst + 1;
  firstValue.style.cssText = 'text-align: center;';
  let secondValue = document.createElement("td");
  secondValue.innerHTML = insertSecond;
  let thirdValue = document.createElement("td");
  thirdValue.innerHTML = insertThird;
  let fourthValue = document.createElement("td");
  fourthValue.innerHTML = insertFourth;
  let fifthValue = document.createElement("td");
  fifthValue.innerHTML = insertFifth;

  // append new row and five new cells to given table
  document.getElementById(tableBodyID).appendChild(row);
  row.appendChild(firstValue);
  row.appendChild(secondValue);
  row.appendChild(thirdValue);
  row.appendChild(fourthValue);
  row.appendChild(fifthValue);
}


/**
* Creates new table row with eight new table cells and appends the row and these cells to given table.
* In addition, this function writes the three given values (first: +1) in given order into the first three created table cells
* and sets attributes to the other created cells. The first given value is also used for setting the attributes
*
* @private
* @author Katharina Poppinga 450146
* @param insertFirst - first value, to write in first new created cell
* @param insertSecond - second value, to write in second new created cell
* @param insertThird - third value, to write in third new created cell
* @param {string} tableBodyID - ID of the tbody to which to append the new created row and cells
*/
function createEncountersTable(insertFirst, insertSecond, insertThird, tableBodyID){

  // create new table row and eight new table cells and write corresponding values into them
  let row = document.createElement("tr");
  let firstValue = document.createElement("td");
  firstValue.innerHTML = insertFirst + 1;
  firstValue.style.cssText = 'text-align: center;';
  let secondValue = document.createElement("td");
  secondValue.innerHTML = insertSecond;
  secondValue.style.cssText = 'text-align: center;';
  let thirdValue = document.createElement("td");
  thirdValue.innerHTML = insertThird;
  thirdValue.style.cssText = 'text-align: center;';
  let fourthValue = document.createElement("td");
  fourthValue.setAttribute("id", "country" + insertFirst);
  let fifthValue = document.createElement("td");
  fifthValue.setAttribute("id", "weather" + insertFirst);
  fifthValue.style.cssText = 'text-align: center;';
  let sixthValue = document.createElement("td");
  sixthValue.setAttribute("id", "terrain" + insertFirst);
  let seventhValue = document.createElement("td");
  seventhValue.setAttribute("id", "confirm" + insertFirst);
  seventhValue.style.cssText = 'text-align: center;';
  let eighthValue = document.createElement("td");
  eighthValue.setAttribute("id", "share" + insertFirst);
  eighthValue.style.cssText = 'text-align: center;';

  // append new row and eight new cells to given table
  document.getElementById(tableBodyID).appendChild(row);
  row.appendChild(firstValue);
  row.appendChild(secondValue);
  row.appendChild(thirdValue);
  row.appendChild(fourthValue);
  row.appendChild(fifthValue);
  row.appendChild(sixthValue);
  row.appendChild(seventhValue);
  row.appendChild(eighthValue);
}


/**
* Creates new table row with five new table cells and appends the row and these cells to given table.
* In addition, this function writes the first two given values in given order into the first two created table cells
* and sets attributes to the other created cells. For setting the attributes the third given value is used.
*
* @private
* @author Katharina Poppinga 450146
* @param insertFirst - first value, to write in first new created cell
* @param insertSecond - second value, to write in second new created cell
* @param insertThird - third value, used to set attributes to cells number three, four and five
* @param {string} tableBodyID - ID of the tbody to which to append the new created row and cells
*/
function createSingleEncounterTable(insertFirst, insertSecond, insertThird, tableBodyID){

  // create new table row and five new table cells and write corresponding values into them
  let row = document.createElement("tr");
  let firstValue = document.createElement("td");
  firstValue.innerHTML = insertFirst;
  let secondValue = document.createElement("td");
  secondValue.innerHTML = insertSecond;
  let thirdValue = document.createElement("td");
  thirdValue.setAttribute("id", "country" + insertThird);
  let fourthValue = document.createElement("td");
  fourthValue.setAttribute("id", "weather" + insertThird);
  fourthValue.style.cssText = 'text-align: center;';
  let fifthValue = document.createElement("td");
  fifthValue.setAttribute("id", "terrain" + insertThird);

  // append new row and five new cells to given table
  document.getElementById(tableBodyID).appendChild(row);
  row.appendChild(firstValue);
  row.appendChild(secondValue);
  row.appendChild(thirdValue);
  row.appendChild(fourthValue);
  row.appendChild(fifthValue);
}


/**
* Removes all children of a given HTMLelement (DOM node).
*
* @author Katharina Poppinga 450146
* @param {string} elementId - ID of the element whose children will be removed
*/
function deleteAllChildrenOfElement(elementId){

  // pick the element belonging to given Id
  let element = document.getElementById(elementId);

  // while-loop, while the element has any children (includes also only one child) left, remove the first child of its children
  while (element.hasChildNodes()) {
    element.removeChild(element.firstChild);
  }
}
