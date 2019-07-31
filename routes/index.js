var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


// get all routes and send them to the secretArea.html
var createController = function (req, res, next) {
  res.render("create");
};

router.get("/create", createController);

// --------------------------------------------------------------------------------------------------------------------
//route handler for getting all created (gps-)routes and sending/rendering them

// get all routes in the database and render them to the overview.ejs
var overviewController = function(req, res) {
  req.db.collection('routeDB').find({}).toArray((error, result) => {
    if(error){
      console.dir(error);
    }
    console.log("show all in list");
    console.log(result);
    //display the overview.ejs page and give it the result
    res.render("overview",{ result });
  });
};

// get all routes in the database and send them back
var displayAllController = function(req, res) {
  req.db.collection('routes').find({}).toArray((error, result) => {
    if(error){
      console.dir(error);
    }
    console.log("display all in map");
    res.json(result);
  });
};

router.get("/overview", overviewController);

router.get('/displayAll', displayAllController);

// --------------------------------------------------------------------------------------------------------------------


module.exports = router;
