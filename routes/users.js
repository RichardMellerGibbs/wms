// ROUTES FOR OUR API/SETUP
// =============================================================================
var express    = require('express');
var router     = express.Router();  // get an instance of the express Router
var mongoose   = require('mongoose');
var models     = require('../db/models/user.js');
var jwt        = require('jsonwebtoken');
var config     = require('../config');
var authMiddle = require('../middleware/authenticate.js');
var responses  = require('../middleware/responses.js');
var logger      = require('../utils/logger.js');

var superSecret = config.secret;

//Adding a user entry (accessed at POST http://localhost:8082/api/user)
/*router.post('/',function(req, res) {
  
    logger.info('Received a request to add a user');
    
    var user = new models.User();      // create a new instance of the User model

    user.admin = false;

    //if (!req.body.admin) {
    //    user.admin = false;
    //} else {
    //    user.admin = req.body.admin;
    //}
    
    if (!req.body.username) {
        return res.json({ success: false, message: 'No username specified'});
    } else {
        user.username = req.body.username;
    }
    
    if (!req.body.password) {
        return res.json({ success: false, message: 'No password specified'});
    } else {
        user.password = req.body.password; 
    }
    
    if (!req.body.name) {
        return res.json({ success: false, message: 'No name specified'});
    } else {
       user.name = req.body.name;
    }
       
    // save the user and check for errors
    user.save(function(err) {
        
        if (err) {
            logger.error('Error adding user');

            responses.handleError(err,req,res);   
            return res.json({ success: false, message: 'Internal server error'});
        }

        logger.info('User successfully created userid %s', user._id);
        
        var token = jwt.sign({
            name: user.name,
            username: user.username,
            userid: user._id,
            admin: user.admin
            }, superSecret, {
                expiresIn: 18000 // seconds
            });
        
        
        logger.info('Token signed');

        // return the information including token as JSON
        res.json({
            success: true,
            message: 'User Created. Enjoy your token! Valid for 24 hours',
            token: token
        });
        
        logger.info('Finisahed create user');
    });        
});
*/


//To find a user that has a specified email address
//http://localhost:8082/api/users/checkname/bob@hotmail.com
router.get('/checkname/:username', function(req, res) {
   
	logger.info('Processing api request to get username %s', req.params.username);
    
    if (!req.params.username) {
        return res.json({ success: false, message: 'username not specified'});
    }
    
    models.User.find({username : req.params.username}, function (err, user) {
        
        if (err) {
            logger.error('Error getting users ny name');
            responses.handleError(err,req,res);   
            return res.json({ success: false, message: 'Internal server error'});        
        }
        
        if (user.length){
            //Already exists
            return res.json({ success: true, message: 'EXISTS'});
        }
    
        //Username not found
        return res.json({ success: true, message: 'NOT EXISTS'});
    });

});


// get all the Users (accessed at GET http://localhost:8082/api/users)
//authMiddle.isAuthenticated,
router.get('/', authMiddle.isAuthenticated,  function(req, res) {
//router.get('/', function(req, res) {
	//res.json({ message: 'received a request to get the contacts' });   
	logger.info('Processing api request to get all the users');
    
    /* models.User.find(function(err, users) { */
    models.User.find()
    .sort('name')
    .exec(function(err,users) {
    
        if (err) {
            logger.error('Error getting all users');

            responses.handleError(err,req,res);   
            return res.json({ success: false, message: 'Internal server error'});
        }

        res.json(users);
    });

});


// get the user with that id (accessed at GET http://localhost:xxxx/api/users/:user_id)
//http://localhost:8082/api/users/569b965f352607cc1ea053b6
router.get('/:user_id', authMiddle.isAuthenticated, function(req, res) {

    logger.info('Processing request to get a single user specified by id %s', req.params.user_id);
    
    
    models.User.findById(req.params.user_id, function(err, user) {
    
        if (err) {
            logger.error('Error getting the user schema');

            responses.handleError(err,req,res);   
            return res.json({ success: false, message: 'Internal server error'});
        }
        
        // return that user
        res.json(user);
    });
});


// update the user with this id (accessed at PUT http://localhost:8080/api/users/:user_id)
router.put('/:user_id', authMiddle.isAuthenticated, function(req, res, next) {
 
    logger.info('Processing request to update a single user specified by id %s', req.params.user_id);
    // use our user model to find the user we want
    models.User.findById(req.params.user_id, function(err, user) {

        if (err) res.send(err);
        
        logger.info('Found the user');
        
        // update the users info only if its new
        if (req.body.name) {
            user.name = req.body.name;
        };
        
        if (req.body.username){
            user.username = req.body.username;
        };
        
        if (req.body.password){ 
            user.password = req.body.password;
        }
        
        if (req.body.admin){ 
            user.admin = req.body.admin;
        }
            
        
        logger.info('About to save the user schema');
        // save the user
        user.save(function(err) {
            
            if (err) {
                
                if (err.code == 11000) {
                    logger.info('A user with that email address already exists');
                    return res.json({ success: false, message: 'A user with that email address already exists. '});
                }
        
                logger.error('Error saving the user schema');
                responses.handleError(err,req,res);   
                return res.json({ success: false, message: 'Internal server error'});
            }
            
            res.json({ success: true, message: 'User updated!' });        
            
        });
        
    });
});



// delete the user with this id (accessed at DELETE http://localhost:8080/api/users/:user_id)
router.delete('/:user_id', authMiddle.isAuthenticated, function(req, res) {
    
    logger.info('Processing request to delete a single user specified by id %s', req.params.user_id);
    
    models.User.remove({_id: req.params.user_id}, function(err, user) {
        
        if (err) {
            logger.error('Error deleting the user schema');

            responses.handleError(err,req,res);   
            return res.json({ success: false, message: 'Internal server error'});
        }
        
        res.json({ message: 'Successfully deleted' });
    });
});



module.exports = router;