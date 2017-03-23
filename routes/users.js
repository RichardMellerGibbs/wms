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
router.post('/', authMiddle.isAuthenticated, function(req, res) {
  
    logger.info('Received a request to add a user');
    
    var user = new models.User();      // create a new instance of the User model
    
    if (!req.body.username) {
        return res.json({ success: false, message: 'No username specified'});
    } else {
        user.username = req.body.username;
    }

    if (!req.body.firstName) {
        return res.json({ success: false, message: 'No First name specified'});
    } else {
        user.firstName = req.body.firstName;
    }

    if (!req.body.surname) {
        return res.json({ success: false, message: 'No surname specified'});
    } else {
        user.surname = req.body.surname;
    }

    logger.info('req.body.customer = ' + req.body.customer);
    if (req.body.customer !== true && req.body.customer !== false) {
        return res.json({ success: false, message: 'No customer identifer specified'});
    } else {
        user.customer = req.body.customer;
    }

    //Admin section. Cannot allow this for normal users.
    if (req.body.admin !== true && req.body.admin !== false) {
        return res.json({ success: false, message: 'No admin identifier specified'});
    } else {
        user.admin = req.body.admin;
    }
    
    if (!req.body.password) {
        return res.json({ success: false, message: 'No password specified'});
    } else {
        user.password = req.body.password; 
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

// update the user with this id (accessed at PUT http://localhost:8080/api/users/:user_id)
router.put('/:user_id', authMiddle.isAuthenticated, function(req, res, next) {
 
    logger.info('Processing request to update a single user specified by id %s', req.params.user_id);
    // use our user model to find the user we want
    models.User.findById(req.params.user_id, function(err, user) {

        if (err) res.send(err);
        
        logger.info('Found the user. firstName = ' + req.body.firstName);
        
        // update the users info only if its new
        if (req.body.firstName) {
            user.firstName = req.body.firstName;
        };

        logger.info('Dealing with surname');

        if (req.body.surname) {
            user.surname = req.body.surname;
        };
        
        if (req.body.username){
            user.username = req.body.username;
        };
        
        if (req.body.password){ 
            user.password = req.body.password;
        }

        if (req.body.mobile){ 
            user.mobile = req.body.mobile;
        }

        if (req.body.office){ 
            user.office = req.body.office;
        }
        
        logger.info('req.body.admin = ' + req.body.admin);

        if (req.body.admin !== true && req.body.admin !== false) {
            return res.json({ success: false, message: 'No admin identifier specified'});
        } else {
            user.admin = req.body.admin;
        }

        if (req.body.customer !== true && req.body.customer !== false) {
            return res.json({ success: false, message: 'No customer identifer specified'});
        } else {
            user.customer = req.body.customer;
        }
        
        if (req.body.customer) {
            user.customer = req.body.customer;
        }    
        
        logger.info('About to save the user schema');
        logger.info('firstname = ' + user.firstName + ' surname ' + user.surname + ' email ' + user.username + ' admin ' + user.admin + ' customer ' + user.customer);
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

//To find a user that has a specified email address
//http://localhost:8082/api/users/checkname/bob@hotmail.com
router.get('/checkname/:username', authMiddle.isAuthenticated, function(req, res) {
   
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





// delete the user with this id (accessed at DELETE http://localhost:8080/api/users/:user_id)
router.delete('/:user_id', authMiddle.isAuthenticated, function(req, res) {
    
    logger.info('Processing request to delete a single user specified by id %s', req.params.user_id);
    
    models.User.remove({_id: req.params.user_id}, function(err, user) {
        
        if (err) {
            logger.error('Error deleting the user schema');

            responses.handleError(err,req,res);   
            return res.json({ success: false, message: 'Internal server error'});
        }
        
        res.json({ success: true, message: 'Successfully deleted' });
    });
});

module.exports = router;