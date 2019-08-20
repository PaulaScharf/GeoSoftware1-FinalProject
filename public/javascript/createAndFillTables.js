// jshint esversion: 6
// jshint maxerr: 1000

"use strict";  // JavaScript code is executed in "strict mode"

/**
* @desc final project, Geosoftware1, SoSe2019
* @author name: Katharina Poppinga, matr.: 450 146; name: Paula Scharf, matr.: 450 334
*/


/**
* CSS format to set the text-align to the center.
* @type {string}
*/
let textAlign = "text-align: center;";


/**
* Creates a new table row with six new table cells and appends the row and these cells to given table.
* Writes the given values (first: +1) in given order into the created table cells.
* In addition, the first created cell is given an ID for a consecutive number of the
* routes and its text-align is set to center.
* @private
* @author Katharina Poppinga, matr.: 450146
* @param insertFirst - first value, to write in first new created cell
* @param insertSecond - second value, to write in second new created cell
* @param insertThird - third value, to write in third new created cell
* @param insertFourth - fourth value, to write in fourth new created cell
* @param insertFifth - fifth value, to write in fifth new created cell
* @param insertSixth - sixth value, to write in sixth new created cell
* @param {string} tableBodyID - ID of the tbody to which to append the new created row and cells
*/
function createUserRouteTable(insertFirst, insertSecond, insertThird, insertFourth, insertFifth, insertSixth, tableBodyID) {

  // create new table row and six new table cells and write corresponding values into them
  let row = document.createElement("tr");
  let firstValue = document.createElement("td");
  firstValue.id = "conseNum" + insertFirst;
  firstValue.innerHTML = insertFirst + 1;
  firstValue.style.cssText = textAlign;
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
* Creates a new table row with five new table cells and appends the row and these cells to given table.
* Writes the given values (first: +1) in given order into the created table cells.
* In addition, the first created cell is given an ID for a consecutive number of the
* routes and its text-align is set to center.
* @private
* @author Katharina Poppinga, matr.: 450146
* @param insertFirst - first value, to write in first new created cell
* @param insertSecond - second value, to write in second new created cell
* @param insertThird - third value, to write in third new created cell
* @param insertFourth - fourth value, to write in fourth new created cell
* @param insertFifth - fifth value, to write in fifth new created cell
* @param {string} tableBodyID - ID of the tbody to which to append the new created row and cells
*/
function createAnimalRouteTable(insertFirst, insertSecond, insertThird, insertFourth, insertFifth, tableBodyID) {

  // create new table row and five new table cells and write corresponding values into them
  let row = document.createElement("tr");
  let firstValue = document.createElement("td");
  firstValue.id = "conseNum" + insertFirst;
  firstValue.innerHTML = insertFirst + 1;
  firstValue.style.cssText = textAlign;
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
* Creates a new table row with seven new table cells and appends the row and these cells to given table.
* Writes the three given values (first: +1) in given order into the first three created table cells
* and sets attributes to the other created cells. The first given value is also used for setting the attributes.
* In addition, the first, second, third, sixth and seventh created cells' text-align is set to center.
* @private
* @author Katharina Poppinga, matr.: 450146
* @param insertFirst - first value, to write in first new created cell
* @param insertSecond - second value, to write in second new created cell
* @param insertThird - third value, to write in third new created cell
* @param insertFourth - fourth value, to write in third new created cell
* @param insertFifth - fifth value, to write in third new created cell
* @param {string} tableBodyID - ID of the tbody to which to append the new created row and cells
 *
*/
function createEncountersTable(insertFirst, insertSecond, insertThird, insertFourth, insertFifth, tableBodyID) {

  // create new table row and seven new table cells and write corresponding values into them
  let row = document.createElement("tr");
  let firstValue = document.createElement("td");
  firstValue.innerHTML = insertFirst + 1;
  firstValue.style.cssText = textAlign;
  let secondValue = document.createElement("td");
  secondValue.innerHTML = insertSecond;
  secondValue.style.cssText = textAlign;
  let thirdValue = document.createElement("td");
  thirdValue.innerHTML = insertThird;
  thirdValue.style.cssText = textAlign;
  let fourthValue = document.createElement("td");
  fourthValue.innerHTML = insertFourth;
  fourthValue.style.cssText = textAlign;
  let fifthValue = document.createElement("td");
  fifthValue.innerHTML = insertFifth;
  fifthValue.style.cssText = textAlign;
  let sixthValue = document.createElement("td");
  sixthValue.setAttribute("id", "country" + insertFirst);
  let seventhValue = document.createElement("td");
  seventhValue.setAttribute("id", "terrain" + insertFirst);
  let eighthValue = document.createElement("td");
  eighthValue.setAttribute("id", "confirm" + insertFirst);
  eighthValue.style.cssText = textAlign;
  let ninthValue = document.createElement("td");
  ninthValue.setAttribute("id", "share" + insertFirst);
  ninthValue.style.cssText = textAlign;

  // append new row and seven new cells to given table
  document.getElementById(tableBodyID).appendChild(row);
  row.appendChild(firstValue);
  row.appendChild(secondValue);
  row.appendChild(thirdValue);
  row.appendChild(fourthValue);
  row.appendChild(fifthValue);
  row.appendChild(sixthValue);
  row.appendChild(seventhValue);
  row.appendChild(eighthValue);
  row.appendChild(ninthValue);
}


/**
* Creates a new table row with five new table cells and appends the row and these cells to given table.
* Writes the first two given values in given order into the first two created table cells
* and sets attributes to the other created cells. For setting the attributes the third given value is used.
* In addition, the fourth created cells' text-align is set to center.
* @private
* @author Katharina Poppinga, matr.: 450146
* @param insertFirst - first value, to write in first new created cell
* @param insertSecond - second value, to write in second new created cell
* @param insertThird - third value, used to set attributes to cells number three, four and five
* @param {string} tableBodyID - ID of the tbody to which to append the new created row and cells
*/
function createSingleEncounterTable(insertFirst, insertSecond, insertThird, tableBodyID) {

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
  fourthValue.style.cssText = textAlign;
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
* @author Katharina Poppinga, matr.: 450146
* @param {string} elementId - ID of the element whose children will be removed
*/
function deleteAllChildrenOfElement(elementId) {

  // pick the element belonging to given Id
  let element = document.getElementById(elementId);

  // while-loop, while the element has any children (includes also only one child) left, remove the first child of its children
  while (element.hasChildNodes()) {
    element.removeChild(element.firstChild);
  }
}
