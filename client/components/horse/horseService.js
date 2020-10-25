angular
  .module('horseService', [])

  // ===================================================
  // Factory to support horse information
  // ===================================================
  .factory('Horse', function ($http, $q, AuthToken) {
    // create a new object
    var horseFactory = {};

    // get all the horse data
    horseFactory.all = function () {
      //Log.logEntry('trying to get all the horses');
      return $http.get('/api/horse/');
    };

    // get a single horse item
    horseFactory.get = function (id) {
      //Log.logEntry('trying to a single horse');
      return $http.get('/api/horse/' + id);
    };

    // add a horse article
    horseFactory.create = function (horseData) {
      return $http
        .post('/api/horse/', horseData)

        .success(function (data) {
          return data;
        })
        .error(function () {});
    };

    // update horse data
    horseFactory.update = function (id, horseData) {
      return $http.put('/api/horse/' + id, horseData);
    };

    // Delete the horse article
    horseFactory.delete = function (id) {
      return $http.delete('/api/horse/' + id);
    };

    // return our entire successFactory object
    return horseFactory;
  });
