angular.module('userService', [])

// ===================================================
// Factory to support users
// ===================================================
.factory('User', function($http) {

    // create a new object
    var userFactory = {};
    
    // get all the the users
    userFactory.all = function() {
        return $http.get('/api/users/');
    };

    // get a single user
    userFactory.get = function(id) {
        return $http.get('/api/users/' + id);
    };

    // get a single user by username or email
    userFactory.getName = function(username) {
        return $http.get('/api/users/checkname/' + username);
    };

    // add a user
    userFactory.create = function(userData) {
        return $http.post('/api/users/', userData)
    };

    // update user
    userFactory.update = function(id, userData) {
        return $http.put('/api/users/' + id, userData);
    };

    // delete user
    userFactory.delete = function(id) {
        return $http.delete('/api/users/' + id);
    };

    // return our entire userFactory object
    return userFactory;

});