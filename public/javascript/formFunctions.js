// jshint esversion: 6
// jshint maxerr: 1000

"use strict";  // JavaScript code is executed in "strict mode"

/**
* @desc final project, Geosoftware1, SoSe2019
* @author name: Katharina Poppinga, matr.: 450 146; name: Paula Scharf, matr.: 450 334
*/


/**
 * This function checks wether all the necessary elements of the form for creating/updating a route have been filled.
 * It is called whenever the content of an element of the form changes or a key is pressed inside the element.
 * @private
 * @author Paula Scharf 450 334
 */
function checkform() {

  let form = document.getElementById("createUpdateForm").elements;
  let cansubmit = true;

  // if one of the elements of the form is empty then set cansubmit to false
  for (let i = 1; i < 5; i++) {
    if (form[i].value.length === 0) cansubmit = false;
  }
  document.getElementById('submitbutton').disabled = !cansubmit;

  if(cansubmit) {
    document.getElementById("errorMsg").style.display = "none";
    // show an error message if the submitbutton is disabled
  }  else {
    document.getElementById("errorMsg").style.display = "block";
  }
}


/**
* This function checks wether the chosen timestamp is ahead or behind the current time.
 * If it is ahead it disables the option to set the type of the route to "completed"
 * (because a route the lies in the future could not have been completed).
* @private
* @author Paula Scharf 450 334
*/
function checkTimestamp() {
  let datetimeString = document.getElementById("date").value;
  let timeString = document.getElementById("time").value;

  // only check the time, if both date and time element have a value
  if (datetimeString !== "" && timeString !== "") {
    datetimeString += "T" + timeString + "Z";

    let datetime = new Date(datetimeString);

    let currentDatetime = Date.now();

    // the radiobutton for setting the type of a route to "completed"
    let completedRadio = document.getElementById("completedRadio");

    if (datetime > currentDatetime) {
      if (completedRadio.checked) {
        document.getElementById("plannedRadio").checked = true;
      }
      completedRadio.disabled = true;
    } else {
      completedRadio.disabled = false;
    }
  }
}
