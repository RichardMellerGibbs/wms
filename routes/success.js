// ROUTES FOR OUR SUCCESS API
// =============================================================================
var express    = require('express');
var router     = express.Router();  // get an instance of the express Router
var mongoose   = require('mongoose');
var models     = require('../db/models/success.js');
var authMiddle = require('../middleware/authenticate.js');
var responses  = require('../middleware/responses.js');
var logger      = require('../utils/logger.js');

// get all the success data (accessed at GET http://localhost:8082/api/success)
router.get('/', function(req, res) {

    logger.info('Processing api request to get all the success data');
        
    models.Success.find()
    .sort({'articleDate': 'desc'})
    .exec(function(err, success) {        
        
        if (err) {
            logger.error('Error getting all success data');

            responses.handleError(err,req,res);   
            return res.json({ success: false, message: 'Internal server error'});
        }
        
        res.json(success);
        
    });
});


//Get a specific success entry (accessed at GET http://localhost:8082/api/success/:success_id)
router.get('/:success_id', function(req, res) {

    logger.info('Processing request to get a single success article specified by id %s', req.params.success_id);
    
    if (req.params.success_id === undefined) {
        return res.json({ success: false, message: 'No success_id specified'});
    }
    
    models.Success.findById(req.params.success_id, function(err, success) {
        
        if (err) {
            logger.error('Error getting the success schema');

            responses.handleError(err,req,res);   
            return res.json({ success: false, message: 'Internal server error'});
        }        
        
        if (!success) {
            //No data found
            responses.handleError(new Error('Error finding the success id ' + req.params.success_id),req,res);  
            return res.json({ success: false, message: 'Internal server error'});
        }
    
        res.json(success);
    });
});

//Adding an article (accessed at POST http://localhost:8082/api/success)
//authMiddle.isAuthenticated,
router.post('/', authMiddle.isAuthenticated,  function(req, res) {
  
    logger.info('Received a request to add a success article');
    
    //VALIDATION
    if (!req.body.type) {
        return res.json({ success: false, message: 'No type specified'});
    }

    if (!req.body.articleDate) {
        return res.json({ success: false, message: 'No articleDate specified'});
    }

    if (req.body.type !== 'gallery') {
        if (!req.body.description) {
            return res.json({ success: false, message: 'No description specified'});
        }
    }

    if (req.body.articleUrlDescription) {
        if (!req.body.articleUrl) {
            return res.json({ success: false, message: 'An articleUrl must be specified if a URL description is present'});
        }    
    }
    
    //PREPARE THE SCHEMA
    var success = new models.Success();      // create a new instance of the success model
    
    if (req.body.title){
        success.title = req.body.title;
    }

    if (req.body.by){
        success.by = req.body.by;
    }

    if (req.body.picture){
        success.picture = req.body.picture;
    }

    //Only populate the model with the url if one is specified 
    if (req.body.articleUrl) {
        if (req.body.articleUrlDescription) {
            success.articleUrlDescription = req.body.articleUrlDescription;
        } else {
            success.articleUrlDescription = req.body.articleUrl;
        }

        success.articleUrl = req.body.articleUrl;
    }

    success.type = req.body.type;  
    success.description = req.body.description; 
    success.articleDate = new Date(req.body.articleDate).toISOString();
    
    logger.info('req.body.name %s', req.body.type);
    logger.info('req.body.description %s', req.body.description);
    logger.info('req.body.picture %s', req.body.picture);
    logger.info('req.body.articleUrl %s', req.body.articleUrl);
    logger.info('req.body.articleUrlDescription %s', req.body.articleUrlDescription);
    
    // save the success and check for errors
    success.save(function(err) {
        
        if (err) {

            logger.error('Error adding success article');
            responses.handleError(err,req,res);   
            return res.json({ success: false, message: 'Internal server error'});
        }

        logger.info('Success entry successfully created success_id %s', success._id);

        // return the information including token as JSON
        res.json({
            success: true,
            message: 'Success article created'
        });
    });        
});

// update the success page entry with this id (accessed at PUT http://localhost:8080/api/success/:success_id)
//authMiddle.isAuthenticated,
router.put('/:success_id', authMiddle.isAuthenticated, function(req, res) {
 
    logger.info('Processing request to update success article');

    models.Success.findById(req.params.success_id , function(err, success) {

        if (err) {
            logger.error('Error getting success entry %s', req.params.success_id);

            responses.handleError(err,req,res);   
            return res.json({ success: false, message: 'Internal server error'});
        }
        
        logger.info('Found success entry %s', req.params.success_id);
        logger.info('Description %s', req.body.description);
        logger.info('Title %s', req.body.title);
        logger.info('Type %s', req.body.type);

        // VALIDATION
        if (req.body.articleUrlDescription) {
            if (!req.body.articleUrl) {
                return res.json({ success: false, message: 'An articleUrl must be specified if a URL description is present'});
            }    
        }
        
        // PREPARE THE SCHEMA
        if (req.body.description){
            logger.info('description is populated');
            success.description = req.body.description;
        }
        
        if (req.body.title){
            logger.info('title is populated');
            success.title = req.body.title;
        }

        if (req.body.type){
            logger.info('type is populated');
            success.type = req.body.type;
        }

        if (req.body.by){
            logger.info('by is populated');
            success.by = req.body.by;
        }

        if (req.body.articleDate){
            logger.info('articleDate is populated');
            success.articleDate = new Date(req.body.articleDate).toISOString();
        }

        if (req.body.picture){
            logger.info('picture is populated %s', req.body.picture);
            success.picture = req.body.picture;
        }

        //Only populate the model with the url if one is specified 
        if (req.body.articleUrl) {
            if (req.body.articleUrlDescription) {
                success.articleUrlDescription = req.body.articleUrlDescription;
            } else {
                success.articleUrlDescription = req.body.articleUrl;
            }

            success.articleUrl = req.body.articleUrl;
        }
        
        logger.info('About to save the success schema');
        // save the success
        success.save(function(err) {
            
            if (err) {
                logger.error('Error saving success entry');

                responses.handleError(err,req,res);   
                return res.json({ success: false, message: 'Internal server error'});
            }

            // return a message
            res.json({ 
                success: true,
                message: 'Success article updated!' 
            });
        });        
    });            
});


// delete the success with this id (accessed at DELETE http://localhost:8080/api/success/:success_id)
//authMiddle.isAuthenticated,
router.delete('/:success_id', authMiddle.isAuthenticated, function(req, res) {
    
    logger.info('Processing request to delete success specified by id %s', req.params.success_id);
    
    models.Success.remove({_id: req.params.success_id}, function(err, user) {
        
        if (err) {
            logger.error('Error deleting success article');

            responses.handleError(err,req,res);   
            return res.json({ success: false, message: 'Internal server error'});
        }

        res.json({ 
            success: true,
            message: 'Success article successfully deleted' 
        });
    });
});


module.exports = router;