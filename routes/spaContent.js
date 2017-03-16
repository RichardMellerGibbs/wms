// =============================================================================
// ROUTES FOR OUR CONTENT API
// =============================================================================
var express    = require('express');
var router     = express.Router();  // get an instance of the express Router
var mongoose   = require('mongoose');
var models     = require('../db/models/content.js');
var responses  = require('../middleware/responses.js');
var logger      = require('../utils/logger.js');
 //       require('datejs');

// get all the content data (accessed at GET http://localhost:8082/api/spaContent)
router.get('/:prefix', function(req, res) {

    logger.info('Processing api request to get all the spaContent data');

    if (req.params.prefix === undefined) {
        return res.json({ success: false, message: 'No prefix specified'});
    }

    models.Content.find({subject : new RegExp('^' + req.params.prefix)}, function (err, content) {
    
        if (err) {
            logger.error('Error getting all spaContent data');

            responses.handleError(err,req,res);   
            return res.json({ success: false, message: 'Internal server error'});

        } else {
            res.json(content);
        }
    });
});

module.exports = router;