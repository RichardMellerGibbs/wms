// ROUTES FOR THE API - MAIN
// =============================================================================
var express = require('express');
var router = express.Router();  // get an instance of the express Router
var logger      = require('../utils/logger.js');

// test route to make sure everything is working (accessed at GET http://localhost:8083/api)

// middleware to use for all requests
router.use(function(req, res, next) {
    // do logging
    logger.info('Something is happening');
    next(); // make sure we go to the next routes and don't stop here
});

module.exports = router;