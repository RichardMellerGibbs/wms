// ROUTES FOR THE API
// =============================================================================
//Define the route files. These have been split up by function
module.exports = function (app) {
  app.use('/api', require('./main.js'));
  app.use('/api/authenticate', require('./authenticate.js'));
  app.use('/api/users', require('./users.js'));
  app.use('/api/me', require('./me.js'));
  app.use('/api/forgot', require('./forgot.js'));
  app.use('/api/content', require('./content.js'));
  app.use('/api/news', require('./news.js'));
  app.use('/api/upload', require('./upload.js'));
  app.use('/api/horse', require('./horse.js'));
  app.use('/api/success', require('./success.js'));
  app.use('/reset', require('./reset.js'));
  app.use('/api/spaContent', require('./spaContent.js'));
};
