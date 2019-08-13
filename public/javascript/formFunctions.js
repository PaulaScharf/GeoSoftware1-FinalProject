function checkform()
{
    var f = document.getElementById("createUpdateForm").elements;
    var cansubmit = true;

    for (var i = 1; i < 5; i++) {
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