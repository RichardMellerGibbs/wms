angular.module('logService', [])

// ===================================================
// Factory to support logging
// ===================================================
.factory('Log', function() {

    // create a new object
    var logFactory = {};
    
    // get all the success data
    logFactory.logEntry = function(item) {
        //console.log('Special logservice entry ' + item);
    };
    
    // return our entire logFactory object
    return logFactory;

});