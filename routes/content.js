// =============================================================================
// ROUTES FOR OUR CONTENT API
// =============================================================================
var express    = require('express');
var router     = express.Router();  // get an instance of the express Router
var mongoose   = require('mongoose');
var models     = require('../db/models/content.js');
var authMiddle = require('../middleware/authenticate.js');
var responses  = require('../middleware/responses.js');
var logger      = require('../utils/logger.js');
 //       require('datejs');

// get all the content data (accessed at GET http://localhost:8082/api/content)
router.get('/', function(req, res) {

    logger.info('Processing api request to get all the content data');
        
    models.Content.find()
    .sort({'subject': 'asc'})
    .exec(function(err, content) {        
        
        if (err) {
            logger.error('Error getting all content data');

            responses.handleError(err,req,res);   
            return res.json({ success: false, message: 'Internal server error'});
        }

        var footerContentFound = false;

        for (i=0; i<content.length; i++ ){
            if (content[i].subject === 'Footer Address Line 1') {
                footerContentFound = true;
                logger.info('Footer address line1 found');
            }
        }

        

        if (content.length === 0 || footerContentFound === false) {
        //if (content.length === 0) {
            logger.info('no content data found');
            //No data found. Populate base data for a new instance of the database.
            
            var homeData = [
                {
                    subject: 'Section 1 Column 1 Paragraph 1',
                    description: 'Located in the heart of the Nottinghamshire countryside just over an hour from Newmarket, Whatton Manor Stud resides in the famous Vale of Belvoir. Renowned for its professionalism and high standards of care, Whatton Manor Stud achieves consistently impressive results at the sales and on the racetrack.'
                },
                {
                    subject: 'Section 1 Column 1 Paragraph 2',
                    description: 'The stud comprises 500 acres of prime pasture that has proved extremely successful in raising racehorses.'
                },
                {
                    subject: 'Section 1 Column 1 Paragraph 3',
                    description: 'We are a family run business, offering boarding facilities for foals, yearlings and broodmares and consign at all major sales. We offer a range of services focused on the breeding, consigning, breaking and pre-training of racehorses. Our clients are always welcome to visit and are happy in the knowledge that their horses are receiving the best possible care and attention.'
                },
                {
                    subject: 'Section 1 Column 1 Paragraph 4',
                    description: 'Whatton Manor Studs highly experienced staff – some of whom have been at the stud for more than 20 years – ensure the very best of care for the horses.'
                },
                //Next Section
                //Column 1
                {
                    subject: 'Section 2 Column 1 Paragraph 1',
                    description: 'Ed and Katherine Player manage an experienced team on call 24 hours a day. Their close proximity to Newmarket means that walking in stallions is very easy from the stud. The 550 acres of paddocks mean enable them to rear youngstock through until their Sales Preparation or they go into training'
                },
                {
                    subject: 'Section 2 Column 1 Paragraph 2',
                    description: ''
                },
                {
                    subject: 'Section 2 Column 1 Paragraph 3',
                    description: ''
                },
                //Column 2
                {
                    subject: 'Section 2 Column 2 Paragraph 1',
                    description: 'The stud boasts some of the finest facilities available including two covered Claydon horse walkers and a lunge ring.'
                },
                {
                    subject: 'Section 2 Column 2 Paragraph 2',
                    description: 'WMS consigns all the major yearling and Breeding stock sales in England. Our sales team will ensure that we achieve the best possible price for your horse and that they will be prepared to the highest standard using our state of the art facilities.'
                },
                {
                    subject: 'Section 2 Column 2 Paragraph 3',
                    description: ''
                },
                //Column 3
                {
                    subject: 'Section 2 Column 3 Paragraph 1',
                    description: 'Acres of surrounding natural countryside helps each horse reach their peak at the optimum time for their relevant sale. The stud offers sales preparation for foals, yearlings and broodmares Each horse has its own individual preparation tailor-made to its own specific needs.'
                },
                {
                    subject: 'Section 2 Column 3 Paragraph 2',
                    description: ''
                },
                {
                    subject: 'Section 2 Column 3 Paragraph 3',
                    description: ''
                },
                //Footer
                {
                    subject: 'Footer Address Line 1',
                    description: 'WHATTON MANOR STUD'
                },
                {
                    subject: 'Footer Address Line 2',
                    description: 'Whatton in the Vale'
                },
                {
                    subject: 'Footer Address Line 3',
                    description: 'Nottinghamshire'
                },
                {
                    subject: 'Footer Address Line 4',
                    description: 'NG13 9EX'
                },
                {
                    subject: 'Footer Office Phone',
                    description: 'Office: 01949 850221'
                },
                {
                    subject: 'Footer Fax',
                    description: 'Fax: 01949 850993'
                },
                {
                    subject: 'Footer Office Email',
                    description: 'email: player@whattonmanorstud.fsnet.co.uk'
                },
                {
                    subject: 'Footer First Contact Name',
                    description: 'Peter Player'
                },
                {
                    subject: 'Footer First Contact Phone',
                    description: 'Mobile: 0786 0322322'
                },
                {
                    subject: 'Footer First Contact Email',
                    description: 'email: peterplayer@rocketmail.com'
                },
                {
                    subject: 'Footer Second Contact Name',
                    description: 'Edward Player'
                },
                {
                    subject: 'Footer Second Contact Phone',
                    description: 'Mobile: 0773 3261757'
                },
                {
                    subject: 'Footer Second Contact Email',
                    description: 'email: player.edward@gmail.com'
                }
            ];

            
            var content = new models.Content();
            
            content.collection.insert(homeData, function(err) {
        
                if (err) {

                    logger.error('Error adding home entries');
                    responses.handleError(err,req,res);   
                    return res.json({ success: false, message: 'Internal server error'});
                }

                logger.info('Home entries successfully created');

                // return the information including token as JSON
                res.json(homeData);
            });
            
            
        } else {
            res.json(content);
        }
    });
});

// update the content page entry with this id (accessed at PUT http://localhost:8080/api/content/:content_id)
//authMiddle.isAuthenticated,
router.put('/:content_id', authMiddle.isAuthenticated,  function(req, res) {
 
    logger.info('Processing request to update content data');

    models.Content.findById(req.params.content_id , function(err, content) {

        if (err) {
            logger.error('Error getting content entry %s', req.params.content_id);

            responses.handleError(err,req,res);   
            return res.json({ success: false, message: 'Internal server error'});
        }
        
        logger.info('Found content entry %s', req.params.content_id);
        logger.info('Description %s', req.params.description);
        logger.info('Title %s', req.params.title);
        
        content.description = req.body.description;
        
        if (req.body.title){
            logger.info('title is populated');
            content.title = req.body.title;
        }
        
        logger.info('About to save the content schema');
        // save the user
        content.save(function(err) {
            
            if (err) {
                logger.error('Error saving content entry');

                responses.handleError(err,req,res);   
                return res.json({ success: false, message: 'Internal server error'});
            }

            // return a message
            res.json({ 
                success: true,
                message: 'Content entry updated!' 
            });
        });        
    });            
});

//Adding an entry (accessed at POST http://localhost:8082/api/content)
router.post('/', authMiddle.isAuthenticated, function(req, res) {
  
    logger.info('Received a request to add a content entry');
    
    //VALIDATION
    if (!req.body.subject) {
        return res.json({ success: false, message: 'No subject specified'});
    }
    
    var content = new models.Content();      // create a new instance of the Content model
  
    content.description = req.body.description; 
    content.subject = req.body.subject; 
    
    logger.info('req.body.description %s', req.body.description);
    logger.info('req.body.subject %s', req.body.subject);
    
    // save the session and check for errors
    content.save(function(err) {
        
        if (err) {

            logger.error('Error adding content entry');
            responses.handleError(err,req,res);   
            return res.json({ success: false, message: 'Internal server error'});
        }

        logger.info('Content entry successfully created content_id %s', content._id);

        // return the information including token as JSON
        res.json({
            success: true,
            message: 'Content entry created'
        });
    });        
});


// delete the content with this id (accessed at DELETE http://localhost:8080/api/content/:content_id)
//authMiddle.isAuthenticated,
router.delete('/:content_id', authMiddle.isAuthenticated,  function(req, res) {
    
    logger.info('Processing request to delete content specified by id %s', req.params.content_id);
    
    models.Content.remove({_id: req.params.content_id}, function(err, user) {
        
        if (err) {
            logger.error('Error deleting content data');

            responses.handleError(err,req,res);   
            return res.json({ success: false, message: 'Internal server error'});
        }

        res.json({ 
            success: true,
            message: 'Content data successfully deleted' 
        });
    });
});


module.exports = router;