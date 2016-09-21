angular.module('contentService', [])

// ===================================================
// Factory to support content page information
// ===================================================
.factory('Content', function($http, $q, AuthToken) {

    // create a new object
    var contentFactory = {};
    
    // get all the content data
    contentFactory.all = function() {
        return $http.get('/api/content/');
    };
    
    
    // get a single content item
    contentFactory.get = function(id) {
        return $http.get('/api/content/' + id);
    };
    
    
    // update content data
    contentFactory.update = function(id, contentData) {
        return $http.put('/api/content/' + id, contentData);
    };
    
    // return our entire contentFactory object
    return contentFactory;

});