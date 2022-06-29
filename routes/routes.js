var express = require('express');
var router = express.Router();

const deviceIotController = require("../controllers/deviceIotController");
/**
 * Python test
 */
router.get('/devices', deviceIotController.list);


module.exports = router;