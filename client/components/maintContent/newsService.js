angular.module('newsService', [])

// ===================================================
// Factory to support news information
// ===================================================
.factory('News', function($http, $q, AuthToken) {

    // create a new object
    var newsFactory = {};
    
    // get all the news data
    newsFactory.all = function() {
        return $http.get('/api/news/');
    };
    
    
    // get a single news item
    newsFactory.get = function(id) {
        return $http.get('/api/news/' + id);
    };

    // add a news article
    newsFactory.create = function(newsData) {
        
        return $http.post('/api/news/', newsData)
        
        .success(function(data) {
            return data;
        })
        .error(function() {
        });
    };
    
    
    // update news data
    newsFactory.update = function(id, newsData) {
        return $http.put('/api/news/' + id, newsData);
    };

    // Delete the news article
    newsFactory.delete = function(id) {
        return $http.delete('/api/news/' + id);
    }
    
    // return our entire newsFactory object
    return newsFactory;

});