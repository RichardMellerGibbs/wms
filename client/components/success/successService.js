angular.module('successService', [])

// ===================================================
// Factory to support success information
// ===================================================
.factory('Success', function($http, $q, AuthToken) {

    // create a new object
    var successFactory = {};
    
    // get all the success data
    successFactory.all = function() {
        return $http.get('/api/success/');
    };
    
    
    // get a single success item
    successFactory.get = function(id) {
        return $http.get('/api/success/' + id);
    };

    // add a success article
    successFactory.create = function(successData) {
        
        return $http.post('/api/success/', successData)
        
        .success(function(data) {
            return data;
        })
        .error(function() {
        });
    };
    
    
    // update success data
    successFactory.update = function(id, successData) {
        return $http.put('/api/success/' + id, successData);
    };

    // Delete the success article
    successFactory.delete = function(id) {
        return $http.delete('/api/success/' + id);
    }
    
    // return our entire successFactory object
    return successFactory;

});