// ROUTES FOR OUR HORSE API
// =============================================================================
var express = require('express');
var router = express.Router(); // get an instance of the express Router
var mongoose = require('mongoose');
var models = require('../db/models/horse.js');
var authMiddle = require('../middleware/authenticate.js');
var responses = require('../middleware/responses.js');
var logger = require('../utils/logger.js');
var fs = require('fs');
var config = require('../config');

const docDirectory = config.docDirectory;

const fileExists = (file) => {
  if (!fs.existsSync(file)) {
    return false;
  }
  return true;
};

const mediaSupported = (extension) => {
  const supportedVideoFormats = ['PDF'];

  let mediaType = '';
  if (supportedVideoFormats.includes(extension.toUpperCase())) {
    mediaType = 'application/';
    //mediaType = 'video/';
  }

  return mediaType;
};

// get all the horse data (accessed at GET http://localhost:8082/api/horse)
router.get('/', function (req, res) {
  logger.info('Processing api request to get all the horse data');

  models.Horse.find()
    .sort({ articleDate: 'desc' })
    .exec(function (err, horse) {
      if (err) {
        logger.error('Error getting all horse data');

        responses.handleError(err, req, res);
        return res.json({ success: false, message: 'Internal server error' });
      }

      res.json(horse);
    });
});

//Get a specific horse entry (accessed at GET http://localhost:8082/api/horse/:horse_id)
router.get('/:horse_id', function (req, res) {
  logger.info(
    'Processing request to get a single horse entry specified by id %s',
    req.params.horse_id
  );

  if (req.params.horse_id === undefined) {
    return res.json({ success: false, message: 'No horse_id specified' });
  }

  models.Horse.findById(req.params.horse_id, function (err, horse) {
    if (err) {
      logger.error('Error getting the horse schema');

      responses.handleError(err, req, res);
      return res.json({ success: false, message: 'Internal server error' });
    }

    if (!horse) {
      //No data found
      responses.handleError(
        new Error('Error finding the horse id ' + req.params.horse_id),
        req,
        res
      );
      return res.json({ success: false, message: 'Internal server error' });
    }

    let horseDocAvailable = false;

    if (horse.documentlocation) {
      const location = docDirectory;
      const file = location + horse.documentlocation;

      if (fileExists(file)) {
        horseDocAvailable = true;
      }
    }

    horse._doc.horseDocAvailable = horseDocAvailable;

    res.json(horse);
  });
});

//Stream the pdf (accessed at GET http://localhost:8082/{horseid}/streamdocument)
router.get('/:horse_id/streamdocument', function (req, res) {
  logger.info(
    'Processing request to get a horse video specified by id %s',
    req.params.horse_id
  );

  if (req.params.horse_id === undefined) {
    return res.json({ success: false, message: 'No horse_id specified' });
  }

  models.Horse.findById(req.params.horse_id, function (err, horse) {
    if (err) {
      logger.error('Error getting the horse schema');

      responses.handleError(err, req, res);
      return res.json({ success: false, message: 'Internal server error' });
    }

    if (!horse) {
      //No data found
      responses.handleError(
        new Error('Error finding the horse id ' + req.params.horse_id),
        req,
        res
      );
      return res.json({ success: false, message: 'Internal server error' });
    }

    // **************************************************
    // Video from here
    // **************************************************
    const location = docDirectory;
    const file = location + horse.documentlocation;

    if (!fileExists(file)) {
      return res.status(400).json({ error: 'File not found' });
    }

    const extension = file.split('.')[1];

    const mediaType = mediaSupported(extension);
    if (mediaType == '') {
      return res
        .status(400)
        .json({ success: false, message: 'Media not supported' });
    }

    const stat = fs.statSync(file);
    const fileSize = stat.size;
    const range = req.headers.range;
    logger.info(`File stated media type ${mediaType.concat(extension)}`);

    if (range) {
      let [start, end] = range.replace(/bytes=/, '').split('-');
      start = parseInt(start, 10);
      end = end ? parseInt(end, 10) : fileSize - 1;
      const chunksize = end - start + 1;
      const fileStream = fs.createReadStream(file, { start, end });
      res.writeHead(206, {
        'Content-Range': `bytes ${start}-${end}/${fileSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunksize,
        'Content-Type': mediaType.concat(extension),
      });
      logger.info('Ready to stream');
      fileStream.pipe(res);
    } else {
      const head = {
        'Content-Length': fileSize,
        'Content-Type': mediaType.concat(extension),
      };
      res.writeHead(200, head);
      fs.createReadStream(file).pipe(res);
    }
  });
});

//Get a specific event entry (accessed at GET http://localhost:8082/api/news/video)
/*router.get('/:horse_id/streamvideo', function (req, res) {
  logger.info(
    'Processing request to get a horse video specified by id %s',
    req.params.horse_id
  );

  if (req.params.horse_id === undefined) {
    return res.json({ success: false, message: 'No horse_id specified' });
  }

  models.Horse.findById(req.params.horse_id, function (err, horse) {
    if (err) {
      logger.error('Error getting the horse schema');

      responses.handleError(err, req, res);
      return res.json({ success: false, message: 'Internal server error' });
    }

    if (!horse) {
      //No data found
      responses.handleError(
        new Error('Error finding the horse id ' + req.params.horse_id),
        req,
        res
      );
      return res.json({ success: false, message: 'Internal server error' });
    }

    // **************************************************
    // Video from here
    // **************************************************

    //const file =
    //'/Users/richardgibbs/Courses/Jonas NodeJS/2 Intro to Node and NPM/C05-S02-L01.mp4';
    //('/Users/richardgibbs/Documents/Newark Cup Team 2020.mp4');

    const file = horse.videolocation;
    logger.info('File = ', file);

    const extension = file.split('.')[1];

    if (!fileExists(file)) {
      return res
        .status(400)
        .json({ success: false, message: 'File does not exist' });
    }

    const mediaType = mediaSupported(extension);
    if (mediaType == '') {
      return res
        .status(400)
        .json({ success: false, message: 'Media not supported' });
    }

    const stat = fs.statSync(file);
    const fileSize = stat.size;
    const range = req.headers.range;
    logger.info('File stated');

    if (range) {
      let [start, end] = range.replace(/bytes=/, '').split('-');
      start = parseInt(start, 10);
      end = end ? parseInt(end, 10) : fileSize - 1;
      const chunksize = end - start + 1;
      const fileStream = fs.createReadStream(file, { start, end });
      res.writeHead(206, {
        'Content-Range': `bytes ${start}-${end}/${fileSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunksize,
        'Content-Type': mediaType.concat(extension),
      });
      logger.info('Ready to stream');
      fileStream.pipe(res);
    } else {
      const head = {
        'Content-Length': fileSize,
        'Content-Type': mediaType.concat(extension),
      };
      res.writeHead(200, head);
      fs.createReadStream(file).pipe(res);
    }
  });
});*/

// update the horse page entry with this id (accessed at PUT http://localhost:8080/api/horse/:horse_id)
//authMiddle.isAuthenticated,
router.put('/:horse_id', authMiddle.isAuthenticated, function (req, res) {
  logger.info('Processing request to update horse article');

  models.Horse.findById(req.params.horse_id, function (err, horse) {
    if (err) {
      logger.error('Error getting horse entry %s', req.params.horse_id);

      responses.handleError(err, req, res);
      return res.json({ success: false, message: 'Internal server error' });
    }

    logger.info('Found horse entry %s', req.params.horse_id);

    horse.lot = req.body.lot;
    horse.title = req.body.title;
    horse.line2 = req.body.line2;
    horse.line3 = req.body.line3;
    horse.articleDate = req.body.articleDate;
    horse.videolocation = req.body.videolocation;
    horse.documentlocation = req.body.documentlocation;
    horse.picture = req.body.picture;
    horse.description = req.body.description;

    logger.info(
      `About to save the horse schema doc = ${req.body.documentlocation}`
    );
    // save the horse
    horse.save(function (err) {
      if (err) {
        logger.error('Error saving horse entry');

        responses.handleError(err, req, res);
        return res.json({ success: false, message: 'Internal server error' });
      }

      // return a message
      res.json({
        success: true,
        message: 'Horse article updated!',
      });
    });
  });
});

//Adding a horse article (accessed at POST http://localhost:8082/api/horse)
//authMiddle.isAuthenticated,
router.post('/', authMiddle.isAuthenticated, function (req, res) {
  logger.info('Received a request to add a horse article');

  //VALIDATION
  if (!req.body.title) {
    return res.json({ success: false, message: 'No title specified' });
  }

  // PREPARE THE SCHEMA
  var horse = new models.Horse(); // create a new instance of the horse model

  if (req.body.lot) {
    logger.info('lot is populated %s', req.body.lot);
    horse.lot = req.body.lot;
  }

  horse.title = req.body.title;

  if (req.body.line2) {
    horse.line2 = req.body.line2;
  }

  if (req.body.line3) {
    horse.line3 = req.body.line3;
  }

  if (req.body.articleDate) {
    horse.articleDate = new Date(req.body.articleDate).toISOString();
  }

  if (req.body.videolocation) {
    logger.info('videolocation is populated %s', req.body.videolocation);
    horse.videolocation = req.body.videolocation;
  }

  if (req.body.documentlocation) {
    logger.info('documentlocation is populated %s', req.body.documentlocation);
    horse.documentlocation = req.body.documentlocation;
  }

  if (req.body.description) {
    logger.info('description is populated %s', req.body.description);
    horse.description = req.body.description;
  }

  if (req.body.picture) {
    horse.picture = req.body.picture;
  }

  // save the horse and check for errors
  horse.save(function (err) {
    if (err) {
      logger.error('Error adding horse article');
      responses.handleError(err, req, res);
      return res.json({ success: false, message: 'Internal server error' });
    }

    logger.info('Horse entry successfully created horse_id %s', horse._id);

    // return the information including token as JSON
    res.json({
      success: true,
      message: 'Horse article created',
    });
  });
});

// delete the horse with this id (accessed at DELETE http://localhost:8080/api/horse/:horse_id)
//authMiddle.isAuthenticated,
router.delete('/:horse_id', authMiddle.isAuthenticated, function (req, res) {
  logger.info(
    'Processing request to delete horse specified by id %s',
    req.params.horse_id
  );

  models.Horse.remove({ _id: req.params.horse_id }, function (err, user) {
    if (err) {
      logger.error('Error deleting horse article');

      responses.handleError(err, req, res);
      return res.json({ success: false, message: 'Internal server error' });
    }

    res.json({
      success: true,
      message: 'Horse article successfully deleted',
    });
  });
});

module.exports = router;
