var express = require('express');
var router = express.Router();
var controller = require("./Controllers/indexController")

const { check } = require('express-validator/check');

/* GET users homePage. */
router.get('/', controller.index)

/* POST say hello. */
router.post('/',[
    // password must be at least 5 chars long
    check('name').isLength({ min: 2 })
], controller.hello)



module.exports = router;
