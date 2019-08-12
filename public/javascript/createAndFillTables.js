// jshint esversion: 6
// jshint maxerr: 1000

"use strict";  // JavaScript code is executed in "strict mode"

/**
 * @desc final project, Geosoftware1, SoSe2019
 * @author name: Katharina Poppinga, matr.: 450 146; name: Paula Scharf, matr.: 450 334
 */

// please put in your own tokens at 'token.js'




// TODO: ALLE KOMMENTARE UND JSDOC ANPASSEN, WENN TABELLEN FERTIG SIND!!


/**
 * Creates new table row with seven new table cells and appends the row and these cells to given table.
 * In addition, this function writes the first given value into the first cell and second given value into the second cell and ..............
 * The ......
 *
 * @private
 * @author Katharina Poppinga 450146
 * @param tableCellID
 * @param insertFirst - first value, to write in first new created cell
 * @param insertSecond - second value, to write in second new created cell
 * .....
 *
 *
 * @param {string} tableName - table to which the new created row and new created cells are appended
 */
function createAndWriteTableWithSevenCells(tableCellID, insertFirst, insertSecond, insertThird, insertFourth, insertFifth, insertSixth, tableName){

  // create new table row and ANZAHL new table cells and write corresponding values into them
    let row = document.createElement("tr");
    let firstValue = document.createElement("td");
    firstValue.id = "conseNum"+tableCellID;
    firstValue.innerHTML = insertFirst + 1;
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


    // append new row and ANZAHL new cells to given table
    document.getElementById(tableName).appendChild(row);
    row.appendChild(firstValue);
    row.appendChild(secondValue);
    row.appendChild(thirdValue);
    row.appendChild(fourthValue);
    row.appendChild(fifthValue);
    row.appendChild(sixthValue);
}



/**
 * Creates new table row with seven new table cells and appends the row and these cells to given table.
 * In addition, this function writes the first given value into the first cell and second given value into the second cell.
 * The third, fourth, fifth, sixth and seventh cells are getting IDs for writing in the weather and places-information in subsequently called functions.
 *
 * @private
 * @author Katharina Poppinga 450146, Paula Scharf 450334
 * @param insertFirst - first value, to write in first new created cell
 * @param insertSecond - second value, to write in second new created cell
 * @param insertThird - third value, to write in second new created cell
 * @param {string} tableName - table to which the new created row and new created cells are appended
 */
function createAndWriteTableWithThreeCells(insertFirst, insertSecond, insertThird, tableName){
    console.log("three cells");

    // create new table row and three new table cells and write corresponding values into them
    let row = document.createElement("tr");
    let firstValue = document.createElement("td");
    firstValue.innerHTML = insertFirst + 1;
    let secondValue = document.createElement("td");
    secondValue.innerHTML = insertSecond;
    let thirdValue = document.createElement("td");
    thirdValue.innerHTML = insertThird;
    let fourthValue = document.createElement("td");
    fourthValue.setAttribute("id", "country" + insertFirst);
    let fifthValue = document.createElement("td");
    fifthValue.setAttribute("id", "weather" + insertFirst);
    let sixthValue = document.createElement("td");
    sixthValue.setAttribute("id", "terrain" + insertFirst);
    let seventhValue = document.createElement("td");
    seventhValue.setAttribute("id", "confirm"+insertFirst);
    let eigthValue = document.createElement("td");
    eigthValue.setAttribute("id", "share"+insertFirst);

    console.log(tableName);
    // append new row and ANZAHL new cells to given table
    document.getElementById(tableName).appendChild(row);
    row.appendChild(firstValue);
    row.appendChild(secondValue);
    row.appendChild(thirdValue);
    row.appendChild(fourthValue);
    row.appendChild(fifthValue);
    row.appendChild(sixthValue);
    row.appendChild(seventhValue);
    row.appendChild(eigthValue);
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
