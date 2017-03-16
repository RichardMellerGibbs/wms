angular.module('spaContentService', [])

// ===================================================
// Factory to support SPA content page information
// ===================================================
.factory('SpaContent', function($http, $q) {

    // create a new object
    var spaContentFactory = {};
    
    // get all the content data. prefix example - Footer
    spaContentFactory.all = function(prefix) {
        return $http.get('/api/spaContent/' + prefix);
    };

    // return our entire spaContentFactory object
    return spaContentFactory;

});