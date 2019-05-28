var express = require('express');
var router = express.Router();
var controller = require("./Controllers/userController")

/* GET users homePage. */
router.get('/', controller.index)

module.exports = router;
