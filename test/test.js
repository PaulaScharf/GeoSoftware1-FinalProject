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

  it ("Test: Status-Code 200", function (done) {

    try {
      http.get('http://localhost:'+portNumber, function (res) {
        assert.equal(200, res.statusCode);
        done();
      });

    } catch (error){
      console.dir(error);
      assert.ok(false);
      done();
    }
  });



  // ************************* CREATE encounter test *************************

  it ("Test: create an encounter", function(done) {

    //
    let itemID;

    //
    try {
      //
      let optionsCreate = {
        host: "localhost",
        port: portNumber,
        path: "/encounter/create",
        method: "POST",
      };

      //
      let createRequest = http.request(optionsCreate, (createResponse) => {

        let createBody = "";

        //
        createResponse.on("data", (chunk) => {
          createBody += chunk;
        });

        //
        createResponse.on("end", () => {

          assert.ok(createResponse.statusCode === 200);

          itemID = createBody;
          //
          assert.ok(undefined !== itemID);
          done();


          // delete the created item after test has finished:

          //
          itemID = JSON.parse(itemID);
          //
          try {
            //
            let optionsDelete = {
              host: "localhost",
              port: portNumber,
              path: "/encounter/delete?_id=" + itemID,
              method: "GET"
            };

            //
            let deleteRequest = http.request(optionsDelete, (deleteResponse) => {

              let deleteBody = "";

              deleteResponse.on("data", (chunk) => {
                deleteBody += chunk;
              });

              deleteResponse.on("end", () => {
              });
            });

            //
            deleteRequest.setHeader('Content-Type', 'application/json');

            // end of the request
            deleteRequest.end();

            //
          } catch (error){
            console.dir(error);
          }

        });
      });

      //
      createRequest.setHeader('Content-Type', 'application/json');

      // write the data to the request body
      createRequest.write(JSON.stringify({foo: "bar"}));

      // end of the request
      createRequest.end();

      //
    } catch (error){
      console.dir(error);
      assert.ok(false);
      done();
    }
  });



  // ************************* availability of the Animal Tracking API *************************

  it ("Test: availability Animal Tracking API", function (done) {

    //
    try {
      //
      let study_id = 2911040;
      let individualID = "4262-84830876";

      //
      let resource = "https://www.movebank.org/movebank/service/json-auth?study_id=" + study_id + "&individual_local_identifiers[]=" + individualID + "&max_events_per_individual=200&sensor_type=gps";

      //
      let loginname = require(path.join(__dirname, '..', 'public', 'javascript', 'tokens.js')).token.loginnameAnimalTrackingAPI;
      let password = require(path.join(__dirname, '..', 'public', 'javascript', 'tokens.js')).token.passwordAnimalTrackingAPI;

      //
      const options = {
        headers: {
          "Authorization":"Basic " + Buffer.from(loginname+':'+password).toString('base64'),
          "access-control-allow-origin": "localhost:3000",
          "access-control-allow-methods": "GET, POST",
          "access-control-allow-headers": "content-type"
        }
      };

      //
      https.get(resource, options, (response) => {

        //
        assert.ok(response.statusCode === 200);

        //
        let body = "";

        //
        response.on("data", (chunk) => {
          body += chunk;
        });

        //
        response.on("end", () => {

          //
          body = JSON.parse(body);

          //
          assert.ok(undefined !== body);

          done();
        });
      }
    );

    //
  } catch (error) {
    console.dir(error);
    assert.ok(false);
    done();
  }
});
});
