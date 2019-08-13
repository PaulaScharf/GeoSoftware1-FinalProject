// jshint esversion: 8
// jshint node: true
// jshint maxerr: 1000

"use strict";  // JavaScript code is executed in "strict mode"


/**
* @desc final project, Geosoftware1, SoSe2019
* @author name: Katharina Poppinga, matr.: 450 146; name: Paula Scharf, matr.: 450 334
*/



// ********** Mocha server-Tests **********
// starting with npm test (after called npm start)



//
var assert = require("assert");
//
var http = require("http");

// FÜR ANIMAL API???
var https = require("https");

const path = require("path");


//
let portNumber = 3000;




// test suite for ....
// UMEBNENNEN
describe("HTTP-CRUD Test" , function() {


  // ************************* Status-Code 200 Test *************************

  it("Test: Status-Code 200", function (done) {

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

  it("Test: create an encounter", function(done) {

    try {

      let createReq = http.request({
        host: "localhost",
        port: portNumber,
        path: "/encounter/post",
        method: "POST",

      }, (createResponse) => {

        console.log("createBody: ");

        let createBody = "";

        //
        createResponse.on("data", (chunk) => {
          createBody += chunk;
        });

        //
        createResponse.on("end", () => {
          console.log("createBody2: ", 	createBody);


          let data = createBody;
          //console.dir(data);

          // WIRD NUR GEPRÜFT, OB DIE ID VORHANDEN IST, MEHR NICHT??
          assert.ok(undefined !== data);

          done();
        });
      });


      //
      createReq.setHeader('Content-Type', 'application/json');

      // write the data to the request body
      createReq.write(JSON.stringify({foo: "bar"}));

      // end of the request
      createReq.end();

      //
    } catch (error){
      console.dir(error);
      assert.ok(false);
      done();
    }
  });



  // ************************* availability of the Animal Tracking API *************************


  it("Test: availability Animal Tracking API", function (done) {

    try {

//app.get("/animalTrackingAPI",  (req, res) => {

      let study_id = 2911040;
      let individualID = "4262-84830876";


      let resource = "https://www.movebank.org/movebank/service/json-auth?study_id=" + study_id + "&individual_local_identifiers[]=" + individualID + "&max_events_per_individual=200&sensor_type=gps";
      //https://www.movebank.org/movebank/service/public/json?study_id=533575900&max_events_per_individual=200&sensor_type=gps


      // ZURÜCK
      let loginname = require(path.join(__dirname, '..', 'public', 'javascript', 'tokens.js')).token.loginnameAnimalTrackingAPI;
      let password = require(path.join(__dirname, '..', 'public', 'javascript', 'tokens.js')).token.passwordAnimalTrackingAPI;

      //
      const options = {

        //  method: 'GET',
        headers: {
          'Authorization':'Basic ' + Buffer.from(loginname+':'+password).toString('base64')
          //    "access-control-allow-origin": "localhost:3000",
          //    "access-control-allow-methods": "GET, POST",
          //    "access-control-allow-headers": "content-type"
        }
      };




      let createReq = https.get(resource, options, (httpResponse) => {

      }, (createResponse) => {

        console.log("createBody: ");

        let createBody = "";

        //
        createResponse.on("data", (chunk) => {
          createBody += chunk;
        });

        //
        createResponse.on("end", () => {
          console.log("createBody2: ", 	createBody);

          createBody = JSON.parse(createBody);

          //
        //  res.send(createBody);


          let data = createBody;
          //console.dir(data);

          // WIRD NUR GEPRÜFT, OB DIE ID VORHANDEN IST, MEHR NICHT??
          assert.ok(undefined !== data);

          done();
        });
      }



  );



      /*
    }).on('error', (error) => {
    // give a notice, that the API request has failed and show the error-message on the console
    console.log("Failure while getting animal tracking data from movebank API.", error.message);

    //httpResponse.on("error", (error) => {
    //console.error(error);
  });

  */



  //
  createReq.setHeader('Content-Type', 'application/json');

  // write the data to the request body
  // TESTDATA
  createReq.write(JSON.stringify(
    {study_id: 2911040,
    individualID: "4262-84830876"}));

    // end of the request
    createReq.end();

    //
  } catch (error){
    console.dir(error);
    assert.ok(false);
    done();
  }
});



});


















// VORLAGEN:


// ************************* CREATE and READ Test *************************
/*
it("test create and read item", function(done) {

try{

let itemId;

let createReq = http.request({
host: "localhost",
port: portNumber,
path: "/item",
method: "POST",
}, (createResponse) => {

let createBody = "";

createResponse.on("data", (chunk) => {
createBody += chunk;
});

createResponse.on("end", () => {
let data = JSON.parse(createBody);
//console.dir(data);
itemId = data._id;
assert.ok(undefined!==data._id);

let readReq = http.request({
host: "localhost",
port: portNumber,
path: "/item?_id=" + itemId,
method: "GET",
}, (readResponse) => {

let readBody = "";

readResponse.on("data", (chunk) => {
readBody += chunk;
});

readResponse.on("end", () => {
let data = JSON.parse(readBody);
//console.dir(data);
assert.ok(undefined!==data._id && data._id==itemId);
done();
});
});


// Write data to request body:

readReq.setHeader('Content-Type', 'application/json');
readReq.end();
});
});


// Write data to request body:

createReq.setHeader('Content-Type', 'application/json');
createReq.write(JSON.stringify({foo: "bar"}));
createReq.end();

} catch(error){
console.dir(error);
assert.ok(false);
done();
}
});
*/


// ************************* CREATE and UPDATE Test *************************
/*
it("test create and update item", function(done) {
try{

let itemId;

let createReq = http.request({
host: "localhost",
port: portNumber,
path: "/item",
method: "POST",
}, (createResponse) => {

let createBody = "";

createResponse.on("data", (chunk) => {
createBody += chunk;
});

createResponse.on("end", () => {

let data = JSON.parse(createBody);
//console.dir(data);
itemId = data._id;
assert.ok(undefined!==data._id);

let req = http.request({
host: "localhost",
port: portNumber,
path: "/item",
method: "PUT",
}, (res) => {

let body = "";

res.on("data", (chunk) => {
body += chunk;
});

res.on("end", () => {
try{
let data = JSON.parse(body);
//console.dir(data);
assert.ok(undefined!==data._id && data._id==itemId);
done();
} catch(error){
console.dir(error);
assert.ok(false);
done();
}
});
});


// Write data to request body:

req.setHeader('Content-Type', 'application/json');
req.write(JSON.stringify({_id: itemId, foo: "bar updated", foo2: "foo2 added"}));
req.end();
});
});


// Write data to request body:

createReq.setHeader('Content-Type', 'application/json');
createReq.write(JSON.stringify({foo: "bar created"}));
createReq.end();

} catch(error){
console.dir(error);
assert.ok(false);
done();
}
});

*/

// ************************* CREATE and DELETE Test *************************
/*
it("test create and delete item", function(done) {

try{

let itemId;

let createReq = http.request({
host: "localhost",
port: portNumber,
path: "/item",
method: "POST"
}, (createResponse) => {

let createBody = "";

createResponse.on("data", (chunk) => {
createBody += chunk;
});

createResponse.on("end", () => {

let data = JSON.parse(createBody);
itemId = data._id;
assert.ok(undefined!==data._id);

let reqBody = JSON.stringify({_id: itemId});

let req = http.request({
host: "localhost",
port: portNumber,
path: "/item?_id=" + itemId,
method: "DELETE"
}, (res) => {

let body = "";

res.on("data", (chunk) => {
body += chunk;
});

res.on("end", () => {
//console.dir({_id: itemId});
let data = JSON.parse(body);
//console.dir(data);
assert.ok(undefined!==data._id && data._id==itemId);
done();

});
});


// Write data to request body:

req.end();
});
});


// Write data to request body:

createReq.setHeader('Content-Type', 'application/json');
createReq.write(JSON.stringify({foo: "bar"}));
createReq.end();

} catch(error){
console.dir(error);
assert.ok(false);
done();
}
});
*/

//});
