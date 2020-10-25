// ROUTES FOR OUR UPLOAD API
// =============================================================================
var express = require('express');
var router = express.Router(); // get an instance of the express Router
var mongoose = require('mongoose');
var models = require('../db/models/horse.js');
var authMiddle = require('../middleware/authenticate.js');
var responses = require('../middleware/responses.js');
var logger = require('../utils/logger.js');
var fs = require('fs');
var multer = require('multer');

var newFilename = '';
var location = '/Users/richardgibbs/Web/Ed/videos/';

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, location);
  },
  filename: function (req, file, cb) {
    newFilename =
      file.originalname.substr(0, file.originalname.lastIndexOf('.')) +
      '-' +
      Date.now() +
      '.pdf';

    cb(null, newFilename);
  },
});

var upload = multer({
  //multer settings
  storage: storage,
}).single('file');

//Get a specific event entry (accessed at GET http://localhost:8082/api/upload/fileupload)
//authMiddle.isAuthenticated,
router.post('/fileupload', function (req, res) {
  logger.info('Processing request to upload a file');

  var path = '';
  upload(req, res, function (err) {
    if (err) {
      // An error occurred when uploading
      logger.info(err);
      return res.status(422).json({ success: false, message: 'Error occured' });
    }
    // No error occured.
    path = req.file.path;
    logger.info('File upload complete ', path);
    return res.status(200).json({ success: true, message: newFilename });
  });
});

module.exports = router;
