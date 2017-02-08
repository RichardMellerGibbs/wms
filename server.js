// =============================================================================
// BASE SETUP
// =============================================================================
var express     = require('express');        // call express
var app         = express();                 // define our app using express
var bodyParser  = require('body-parser');
var mongoose    = require('mongoose');
var config      = require('./config');

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

var port = config.port;
console.log('env is ' + config.node_env);

//Expose the client static files. This includes index.html landing page which gets everything going
app.use(express.static(__dirname + '/client'));

// This will ensure that all routing is handed over to AngularJS 
/*app.get('/*', function(req, res, next) { 
  res.sendFile(__dirname + '/client/index.html');
});*/


app.all('/home', function(req, res, next) {
  res.sendFile('client/index.html', { root: __dirname });
});

//Added to enable correct routing without hash when urls typed directly into the address bar
app.all('/login', function(req, res, next) {
  res.sendFile('client/index.html', { root: __dirname });
});

app.all('/maintContent/:tab', function(req, res, next) {
  res.sendFile('client/index.html', { root: __dirname });
});

app.all('/maintNews/:newsId', function(req, res, next) {
  res.sendFile('client/index.html', { root: __dirname });
});

app.all('/news/:newsId', function(req, res, next) {
  res.sendFile('client/index.html', { root: __dirname });
});

app.all('/success', function(req, res, next) {
  res.sendFile('client/index.html', { root: __dirname });
});

app.all('/gallery', function(req, res, next) {
  res.sendFile('client/index.html', { root: __dirname });
});

app.all('/maintSuccess/:newsId', function(req, res, next) {
  res.sendFile('client/index.html', { root: __dirname });
});

app.all('/testimonial', function(req, res, next) {
  res.sendFile('client/index.html', { root: __dirname });
});

app.all('/maintTestimonial/:testimonialId', function(req, res, next) {
  res.sendFile('client/index.html', { root: __dirname });
});

app.all('/maintGallery/:galleryId', function(req, res, next) {
  res.sendFile('client/index.html', { root: __dirname });
});

app.all('/findUs', function(req, res, next) {
  res.sendFile('client/index.html', { root: __dirname });
});


// =============================================================================
// CONNECT TO MONGO
mongoose.Promise = global.Promise;
mongoose.connect(config.database);

// =============================================================================
// CONNECTION EVENTS

// When successfully connected
mongoose.connection.once('connected', function() {
	console.log("Connected to database")
});

// If the connection throws an error
mongoose.connection.on('error',function (err) {  
  console.log('Mongoose default connection error: ' + err);
}); 

// When the connection is disconnected
mongoose.connection.on('disconnected', function () {  
  console.log('Mongoose default connection disconnected'); 
});

// If the Node process ends, close the Mongoose connection 
process.on('SIGINT', function() {  
  mongoose.connection.close(function () { 
    console.log('Mongoose default connection disconnected through app termination'); 
    process.exit(0); 
  }); 
}); 
// =============================================================================

//This statement sets up all server routing. 
//REGISTER ROUTES
var router	   = require('./routes/index.js')(app);


// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Listening on port ' + port);
