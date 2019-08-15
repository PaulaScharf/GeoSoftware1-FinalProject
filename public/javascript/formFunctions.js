// jshint esversion: 6
// jshint maxerr: 1000

"use strict";  // JavaScript code is executed in "strict mode"

/**
* @desc final project, Geosoftware1, SoSe2019
* @author name: Katharina Poppinga, matr.: 450 146; name: Paula Scharf, matr.: 450 334
*/


/**
*
*
*
*/
function checkform() {

  let f = document.getElementById("createUpdateForm").elements;
  let cansubmit = true;

  for (let i = 1; i < 5; i++) {
    if (f[i].value.length === 0) cansubmit = false;
  }
  document.getElementById('submitbutton').disabled = !cansubmit;

  if(cansubmit) {
    document.getElementById("errorMsg").style.display = "none";
  }
  else
  {
    document.getElementById("errorMsg").style.display = "block";
  }
}


/**
*
*
*
*/
function checkTimestamp() {
  let datetimeString = document.getElementById("date").value;
  let timeString = document.getElementById("time").value;

  if (typeof timeString !== "undefined") {
    datetimeString += "T" + timeString + "Z";

    let datetime = new Date(datetimeString);
    console.log(datetime);

    let currentDatetime = Date.now();

    completedRadio = document.getElementById("completedRadio");

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
