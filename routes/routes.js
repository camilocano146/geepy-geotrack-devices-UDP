var express = require('express');
var router = express.Router();

const deviceIotController = require("../controllers/deviceIotController");
const commandService = require("../controllers/commandController");
/**
 * Python test
 */
router.post('/commands/send', commandService.send);


module.exports = router;