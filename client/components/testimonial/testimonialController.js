angular.module('testimonialCtrl', ['successService','logService'])
.controller('testimonialController', ['$rootScope', '$location', '$routeParams', '$window', 'Success', 'Log', function($rootScope, $location, $routeParams, $window, Success, Log) {  
    
    var vm = this;

    vm.testData = [];
    var testItem = {};

    Log.logEntry('Inside the testimonialController');

    Success.all()
    .success(function(data) {

        Log.logEntry('testimonial count ' + data.length);

        for (i=0; i < data.length; i++) {

            if (data[i].type === 'testimonial') {

                testItem = {
                        id: data[i]._id,
                        by: data[i].by,
                        description: data[i].description
                };

                vm.testData.push(testItem);
            }
            
        }

    });

}]);