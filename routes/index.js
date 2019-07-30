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


module.exports = router;
