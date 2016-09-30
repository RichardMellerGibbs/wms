angular.module('findUsCtrl', ['logService'])
.controller('findUsController', ['$rootScope', '$location', '$routeParams', '$window', 'Log',  function($rootScope, $location, $routeParams, $window, Log) {  
        
    var vm = this;

    Log.logEntry('Inside the findUsController');
    

}]);