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
            if(result != false) {
                let intersectionCoordinates = result;
                let encounter = [intersectionCoordinates, firstId, secondId];
                console.log("encounter: ");
                console.log(encounter);
                allEncounters.push(encounter);
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
    var slope1, slope2, yint1, yint2, intx, inty;
    // if the starting coordinates of the lines are identical, return them as the intersection
    if (x11 == x21 && y11 == y21) return [x11, y11];
    // if the end coordinates of the lines are identical, return them as the intersection
    if (x12 == x22 && y12 == y22) return [x12, y22];

    slope1 = this.slope(x11, y11, x12, y12);
    slope2 = this.slope(x21, y21, x22, y22);
    // If the lines have different start-coord and end-coord but the same slope, there is no intersection
    if (slope1 === slope2) return false;

    yint1 = this.yInt(x11, y11, x12, y12);
    yint2 = this.yInt(x21, y21, x22, y22);
    if (yint1 === yint2) return yint1 === false ? false : [0, yint1];

    if (slope1 === false) return [y21, slope2 * y21 + yint2];
    if (slope2 === false) return [y11, slope1 * y11 + yint1];
    intx = (slope1 * x11 + yint1 - yint2)/ slope2;

    return [intx, slope1 * intx + yint1];
}

/**
 * this function calculates the slope of line.
 * if the slope is zero it returns false.
 * @param x1    x-coord of start of the line
 * @param y1    y-coord of start of the line
 * @param x2    x-coord of end of the line
 * @param y2    y-coord of end of the line
 * @returns slope | false
 * @author name: Paula Scharf, matr.: 450 334
 * @see https://stackoverflow.com/questions/13937782/calculating-the-point-of-intersection-of-two-lines
 */
function slope(x1, y1, x2, y2) {
    if (x1 == x2) return false;
    return (y1 - y2) / (x1 - x2);
}

/**
 * ?
 * @param x1    x-coord of start of the line
 * @param y1    y-coord of start of the line
 * @param x2    x-coord of end of the line
 * @param y2    y-coord of end of the line
 * @returns ?
 * @author name: Paula Scharf, matr.: 450 334
 * @see https://stackoverflow.com/questions/13937782/calculating-the-point-of-intersection-of-two-lines
 */
function yInt(x1, y1, x2, y2) {
    if (x1 === x2) return y1 === 0 ? 0 : false;
    if (y1 === y2) return y1;
    return y1 - slope(x1, y1, x2, y2) * x1 ;
}

