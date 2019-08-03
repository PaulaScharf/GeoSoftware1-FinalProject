var alreadyDefinedRoutes = [];
var allEncounters = [];

/**
 * this route checks, if the ajax-response contains a new route.
 * If the route is new, then the encounters are calculated for it
 * @param response  the response of the ajax-request in readRoutesEncounters.js
 * @author name: Paula Scharf, matr.: 450 334
 */
function checkForNewRoute(response) {
    console.log("check for new routes");
    for(let i = 0; i < response.length; i++) {
        response[i].geoJson.features[0].geometry.coordinates = swapGeoJSONLongLatToLatLongOrder(response[i].geoJson.features[0].geometry.coordinates);
        let routeIdFound = false;
        for(let k = 0; k < alreadyDefinedRoutes.length; k++)
        {
            console.log("ids: " + response[i]._id + ", " + alreadyDefinedRoutes[k]._id)
            if(response[i]._id == alreadyDefinedRoutes[k]._id) {
                routeIdFound = true;
            }
        }
        if(!routeIdFound) {
            calculateEncounters(response[i].geoJson.features[0].geometry.coordinates, response[i]._id);
            alreadyDefinedRoutes.push(response[i]);
        }
    }
}

/**
 * This function calculates all encounters of a given route with all other routes
 * @param oneRoute  a route (only the coordinates)
 * @param oneId     id of oneRoute
 * @author name: Paula Scharf, matr.: 450 334
 */
function calculateEncounters(oneRoute, oneId) {
    for(let i = 0; i < alreadyDefinedRoutes.length; i++) {
        intersectionOfRoutes(oneRoute, alreadyDefinedRoutes[i].geoJson.features[0].geometry.coordinates, oneId, alreadyDefinedRoutes[i]._id);
    }
}

/**
 * This function calculates the intersections of between all the straight lines that make up two given routes
 * @param firstRoute    a route (only the coordinates)
 * @param secondRoute   a second route (only the coordinates)
 * @param firstId       id of the first route
 * @param secondId      id of the second route
 * @author name: Paula Scharf, matr.: 450 334
 */
function intersectionOfRoutes(firstRoute, secondRoute, firstId, secondId) {
    for(let i = 1; i < firstRoute.length; i++) {
        for(let k = 1; k < secondRoute.length; k++) {
            var result = getIntersection(firstRoute[i-1].lat, firstRoute[i-1].lng, firstRoute[i].lat, firstRoute[i].lng, secondRoute[k-1].lat, secondRoute[k-1].lng, secondRoute[k].lat, secondRoute[k].lng);
            if(result.features.length > 0) {
                let intersectionCoordinates = result.features[0].geometry.coordinates;
                let encounter = {
                    intersection: intersectionCoordinates,
                    firstRoute: firstId,
                    secondRoute: secondId
                };
                console.log("encounter: ");
                console.log(encounter);
                postEncounter(encounter);
            }
        }
    }

}


/**
 * This function calculates the coordinates of an intersection between two straight lines.
 * If there is no intersection it returns false
 * @param x11   x-coord of start of the first line
 * @param y11   y-coord of start of the first line
 * @param x12   x-coord of end of the first line
 * @param y12   y-coord of end of the first line
 * @param x21   x-coord of start of the second line
 * @param y21   y-coord of start of the second line
 * @param x22   x-coord of end of the second line
 * @param y22   y-coord of end of the second line
 * @returns array of coordinates | false
 * @author name: Paula Scharf, matr.: 450 334
 * @see https://stackoverflow.com/questions/13937782/calculating-the-point-of-intersection-of-two-lines
 */
function getIntersection(x11, y11, x12, y12, x21, y21, x22, y22) {
    var line1 = turf.lineString([[x11, y11], [x12, y12]]);
    var line2 = turf.lineString([[x21, y21], [x22, y22]]);
    var intersects = turf.lineIntersect(line1, line2);
    return intersects;
}

function postEncounter(encounter) {
    $.ajax({
        // use a http POST request
        type: "POST",
        // URL to send the request to
        url: "/encounter/post",
        data : encounter,
        // data type of the response
        dataType: "json"
    })

    // if the request is done successfully, ...
        .done (function (response) {
            console.log("response: ");
            console.log(response);
            // ... give a notice on the console that the AJAX request for pushing an encounter has succeeded
            console.log("AJAX request (pushing an encounter) is done successfully.");
        })
}