// jshint esversion: 6
// jshint maxerr: 1000

"use strict";  // JavaScript code is executed in "strict mode"

/**
* @desc final project, Geosoftware1, SoSe2019
* @author name: Katharina Poppinga, matr.: 450 146; name: Paula Scharf, matr.: 450 334
*/

// please put in your own tokens at 'token.js'


// API used to gain animal tracking data: Movebank's REST API


// ********************** "read and accept license" section to gain the api key for your desired dataset **********************

// entity_type und study_id mitgeben!!

// D:\KPopp\Documents\WWU_Münster\Semester_4\Geosoftware_1\Projektaufgabe\GeoSoftware1-FinalProject-master\GeoSoftware1-FinalProject>curl -v -u KPoppi:U6_l1# -c cookies.txt -o license_terms.txt "https://www.movebank.org/movebank/service/direct-read?entity_type=event&study_id=16615296"

// D:\KPopp\Documents\WWU_Münster\Semester_4\Geosoftware_1\Projektaufgabe\GeoSoftware1-FinalProject-master\GeoSoftware1-FinalProject>CertUtil -hashfile license_terms.txt MD5
// MD5-Hash von license_terms.txt:
// c04dc73305ce34c21397ebbe3e8d73eb
// CertUtil: -hashfile-Befehl wurde erfolgreich ausgeführt.

// D:\KPopp\Documents\WWU_Münster\Semester_4\Geosoftware_1\Projektaufgabe\GeoSoftware1-FinalProject-master\GeoSoftware1-FinalProject>curl -v -u KPoppi:U6_l1# -b cookies.txt -o event_data.csv "https://www.movebank.org/movebank/service/direct-read?entity_type=event&study_id=16615296&license-md5=c04dc73305ce34c21397ebbe3e8d73eb"

// ergibt:
// Server auth using Basic with user 'KPoppi'
// > GET /movebank/service/direct-read?entity_type=event&study_id=16615296&license-md5=c04dc73305ce34c21397ebbe3e8d73eb HTTP/1.1
// > Host: www.movebank.org
// > Authorization: Basic S1BvcHBpOlU2X2wxIw==
// > User-Agent: curl/7.55.1
// > Accept: */*
// > Cookie: JSESSIONID=FF758EC161C69DA722F886B07E0A108A

// HTTP/1.1 200 OK
// < Date: Sun, 04 Aug 2019 20:12:22 GMT
// < Server: Apache-Coyote/1.1
// < Content-Disposition: attachment; filename*=event.csv
// < Content-Type: text/csv
// * Replaced cookie JSESSIONID="F61ECAEFC08A13313375C6168C1EC294" for domain www.movebank.org, path /movebank, expire 0
// < Set-Cookie: JSESSIONID=F61ECAEFC08A13313375C6168C1EC294; Path=/movebank


// API-key: S1BvcHBpOlU2X2wxIw==    ???????



// "Because studies are treated independently, animal and tag identifiers can be assumed to be unique within a
// study but not across studies."



// JSDoc: * @throws request failed: [object ProgressEvent]

// request-resource for getting the animal tracking data
var resource = "https://www.movebank.org/movebank/service/json-auth?&study_id=2911040&individual_local_identifiers[]=4262-84830876&sensor_type=gps";

/*
//
$.ajax({
  // use a http GET request
  type: "GET",
  // URL to send the request to
  url: "/animalTrackingAPI",
//url: resource,

  //
//contentType: "application/json",
  //
//data: resource,

  // data type of the response
  dataType: "json", //application/json?
  //
  xhrFields: {
    withCredentials: true
  }
})

// if the request is done successfully, ...
.done (function (response) {

  console.log("Response: " + JSON.stringify(response));
})

// if the request has failed, ...
.fail (function (xhr, status, error) {
  // ... give a notice that the AJAX request for getting the animal tracking api has failed and show the error-message on the console
  console.log("AJAX request (GET animal tracking api) has failed.", error, error.message);
});
*/






// make route from animal-coordinates:
