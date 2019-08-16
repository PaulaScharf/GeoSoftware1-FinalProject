// jshint esversion: 8
// jshint node: true
// jshint maxerr: 1000

"use strict";  // JavaScript code is executed in "strict mode"


/**
* @desc final project, Geosoftware1, SoSe2019
* @author name: Katharina Poppinga, matr.: 450 146; name: Paula Scharf, matr.: 450 334
*/



// ********** Mocha server-Tests **********
// starting them with npm test (after called npm start)


// load necessary modules:
const assert = require("assert");
const http = require("http");
const https = require("https");
const path = require("path");

const portNumber = 3000;


// test suite for all server-side tests
describe ("Mocha tests" , function() {


  // ************************* Status-Code 200 Test *************************

  // just a small test for receiving status-code 200 when getting http://localhost:3000
  it ("Test: Status-Code 200", function (done) {

    try {
      // get the 'http://localhost:3000'
      http.get('http://localhost:'+portNumber, function (res) {
        // test whether the response-status-code is equal to 200, if so, pass the test
        assert.equal(200, res.statusCode);
        // finish the test
        done();
      });

      // if an error occurs ...
    } catch (error){
      console.dir(error);
      // ... the assertion fails, because assert.ok is only passed if it evaluates to true
      assert.ok(false);
      // finish the test
      done();
    }
  });



  // ************************* CREATE encounter test *************************

  // test for creating/inserting an encounter into the database
  // afterwards the created encounter will be deleted from database (this is not tested in this test)
  it ("Test: create an encounter", function(done) {

    try {
      // set the options for the create-request
      let optionsCreate = {
        host: "localhost",
        port: portNumber,
        path: "/encounter/create",
        method: "POST",
      };

      // define the create-request
      let createRequest = http.request(optionsCreate, (createResponse) => {

        let createBody = "";

        createResponse.on("data", (chunk) => {
          createBody += chunk;
        });

        createResponse.on("end", () => {

          // this assertion passes, if the response-status-code is equal to 200
          assert.ok(createResponse.statusCode === 200);

          let itemID = createBody;

          // this assertion passes, if an itemID is defined during the create-request
          assert.ok(undefined !== itemID);

          // finish the test
          done();


          // ***** delete the created item after test has finished: *****

          // parse the itemID to an object
          itemID = JSON.parse(itemID);

          try {
            // set the options for the delete-request
            let optionsDelete = {
              host: "localhost",
              port: portNumber,
              path: "/encounter/delete?_id=" + itemID,
              method: "GET"
            };

            // define the delete-request
            let deleteRequest = http.request(optionsDelete, (deleteResponse) => {

              let deleteBody = "";

              deleteResponse.on("data", (chunk) => {
                deleteBody += chunk;
              });

              deleteResponse.on("end", () => {
              });
            });

            // set the header for the delete-request
            deleteRequest.setHeader('Content-Type', 'application/json');

            // end of the delete-request
            deleteRequest.end();

            // if an error occurs while deleting ...
          } catch (error){
            // ... show the error on the console
            console.dir(error);
          }
        });
      });

      // set the header for the create-request
      createRequest.setHeader('Content-Type', 'application/json');

      // write the test-data to the request body
      createRequest.write(JSON.stringify({foo: "bar"}));

      // end of the create-request
      createRequest.end();

      // if an error occurs ...
    } catch (error){
      console.dir(error);
      // ... the assertion fails, because assert.ok is only passed if it evaluates to true
      assert.ok(false);
      // finish the test
      done();
    }
  });


  // ************************* availability of the Animal Tracking API *************************

  it ("Test: availability Animal Tracking API", function (done) {

    //
    try {
      // define the test-data
      let study_id = 2911040;
      let individualID = "4262-84830876";

      // define the resource (movebank API URL) to test
      let resource = "https://www.movebank.org/movebank/service/json-auth?study_id=" + study_id + "&individual_local_identifiers[]=" + individualID + "&max_events_per_individual=200&sensor_type=gps";

      // loginname and password needed for authorization during the get-request
      let loginname = require(path.join(__dirname, '..', 'public', 'javascript', 'tokens.js')).token.loginnameAnimalTrackingAPI;
      let password = require(path.join(__dirname, '..', 'public', 'javascript', 'tokens.js')).token.passwordAnimalTrackingAPI;

      // define options for the https-GET request
      const options = {
        // set the headers for the get-request
        headers: {
          "Authorization":"Basic " + Buffer.from(loginname+':'+password).toString('base64'),
          "access-control-allow-origin": "localhost:3000",
          "access-control-allow-methods": "GET, POST",
          "access-control-allow-headers": "content-type"
        },
        // timeout set to 5 seconds
        timeout: 5000
      };

      // execute a https-GET request
      https.get(resource, options, (response) => {

        // this assertion passes, if the response-status-code is equal to 200
        assert.ok(response.statusCode === 200);

        let body = "";

        response.on("data", (chunk) => {
          body += chunk;
        });

        response.on("end", () => {

          body = JSON.parse(body);

          // this assertion passes, if the body is defined during the get-request
          assert.ok(undefined !== body);

          // finish the test
          done();
        });
      });

      // if an error occurs ...
    } catch (error){
      console.dir(error);
      // ... the assertion fails, because assert.ok is only passed if it evaluates to true
      assert.ok(false);
      // finish the test
      done();
    }
  });
});
