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
var displayAllController = function(req, res) {
  req.db.collection('routeDB').find({}).toArray((error, result) => {
    if(error){
      console.dir(error);
    }
    console.log("show all");
    console.log(result);
    //display the overview.ejs page and give it the result
    res.render("overview",{ result });
  });
};

router.get("/overview", displayAllController);

// --------------------------------------------------------------------------------------------------------------------


module.exports = router;
