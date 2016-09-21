// ROUTES FOR OUR NEWS API
// =============================================================================
var express    = require('express');
var router     = express.Router();  // get an instance of the express Router
var mongoose   = require('mongoose');
var models     = require('../db/models/news.js');
var authMiddle = require('../middleware/authenticate.js');
var responses  = require('../middleware/responses.js');
var logger      = require('../utils/logger.js');
 //       require('datejs');

// get all the news data (accessed at GET http://localhost:8082/api/news)
router.get('/', function(req, res) {

    logger.info('Processing api request to get all the news data');
        
    models.News.find()
    .sort({'articleDate': 'desc'})
    .exec(function(err, news) {        
        
        if (err) {
            logger.error('Error getting all news data');

            responses.handleError(err,req,res);   
            return res.json({ success: false, message: 'Internal server error'});
        }
        
        res.json(news);
        
    });
});


//Get a specific event entry (accessed at GET http://localhost:8082/api/news/:news_id)
router.get('/:news_id', function(req, res) {

    logger.info('Processing request to get a single news article specified by id %s', req.params.news_id);
    
    if (req.params.news_id === undefined) {
        return res.json({ success: false, message: 'No news_id specified'});
    }
    
    models.News.findById(req.params.news_id, function(err, news) {
        
        if (err) {
            logger.error('Error getting the news schema');

            responses.handleError(err,req,res);   
            return res.json({ success: false, message: 'Internal server error'});
        }        
        
        if (!news) {
            //No data found
            responses.handleError(new Error('Error finding the news id ' + req.params.news_id),req,res);  
            return res.json({ success: false, message: 'Internal server error'});
        }
    
        res.json(news);
    });
});

// update the news page entry with this id (accessed at PUT http://localhost:8080/api/news/:news_id)
//authMiddle.isAuthenticated,
router.put('/:news_id', authMiddle.isAuthenticated, function(req, res) {
 
    logger.info('Processing request to update news article');

    models.News.findById(req.params.news_id , function(err, news) {

        if (err) {
            logger.error('Error getting news entry %s', req.params.news_id);

            responses.handleError(err,req,res);   
            return res.json({ success: false, message: 'Internal server error'});
        }
        
        logger.info('Found news entry %s', req.params.news_id);
        logger.info('Description %s', req.body.description);
        logger.info('Title %s', req.body.title);
        logger.info('Snippet %s', req.body.snippet);
        
        if (req.body.description){
            logger.info('description is populated');
            news.description = req.body.description;
        }
        
        if (req.body.title){
            logger.info('title is populated');
            news.title = req.body.title;
        }

        if (req.body.snippet){
            logger.info('snippet is populated');
            news.snippet = req.body.snippet;
        }
        
        logger.info('About to save the news schema');
        // save the news
        news.save(function(err) {
            
            if (err) {
                logger.error('Error saving news entry');

                responses.handleError(err,req,res);   
                return res.json({ success: false, message: 'Internal server error'});
            }

            // return a message
            res.json({ 
                success: true,
                message: 'News article updated!' 
            });
        });        
    });            
});

//Adding a news article (accessed at POST http://localhost:8082/api/news)
//authMiddle.isAuthenticated,
router.post('/', authMiddle.isAuthenticated, function(req, res) {
  
    logger.info('Received a request to add a news article');
    
    //VALIDATION
    if (!req.body.articleDate) {
        return res.json({ success: false, message: 'No articleDate specified'});
    }

    if (!req.body.description) {
        return res.json({ success: false, message: 'No description specified'});
    }
    
    if (!req.body.title) {
        return res.json({ success: false, message: 'No title specified'});
    }
    
    var news = new models.News();      // create a new instance of the news model
    
    if (req.body.snippet){
        news.snippet = req.body.snippet;
    }
      
    news.description = req.body.description; 
    news.title = req.body.title;
    news.articleDate = new Date(req.body.articleDate).toISOString();
    
    logger.info('req.body.name %s', req.body.itemType);
    logger.info('req.body.description %s', req.body.description);
    logger.info('req.body.title %s', req.body.title);
    
    // save the news and check for errors
    news.save(function(err) {
        
        if (err) {

            logger.error('Error adding news article');
            responses.handleError(err,req,res);   
            return res.json({ success: false, message: 'Internal server error'});
        }

        logger.info('News entry successfully created news_id %s', news._id);

        // return the information including token as JSON
        res.json({
            success: true,
            message: 'News article created'
        });
    });        
});


// delete the news with this id (accessed at DELETE http://localhost:8080/api/news/:news_id)
//authMiddle.isAuthenticated,
router.delete('/:news_id', authMiddle.isAuthenticated, function(req, res) {
    
    logger.info('Processing request to delete news specified by id %s', req.params.news_id);
    
    models.News.remove({_id: req.params.news_id}, function(err, user) {
        
        if (err) {
            logger.error('Error deleting news article');

            responses.handleError(err,req,res);   
            return res.json({ success: false, message: 'Internal server error'});
        }

        res.json({ 
            success: true,
            message: 'News article successfully deleted' 
        });
    });
});


module.exports = router;