angular.module('successCtrl', ['successService','logService'])
.controller('successController', ['$rootScope', '$location', '$routeParams', '$window', 'Success', 'Log', function($rootScope, $location, $routeParams, $window, Success, Log) {  
    
    var vm = this;
    vm.successData = [];
    var successItem = {};

    Log.logEntry('Inside the successController');

    Success.all()
    .success(function(data) {

        Log.logEntry('success count ' + data.length);

        for (i=0; i < data.length; i++) {

            vm.picturePresent = false;

            if (data[i].type === 'success') {

                if (data[i].picture) {
                    vm.picturePresent = true;
                }

                //vm.articleDate = {value: new Date(data.articleDate)};

                successItem = {
                        id: data[i]._id,
                        title: data[i].title,
                        description: data[i].description,
                        picture: data[i].picture,
                        picturePresent: vm.picturePresent,
                        articleDate: {value: new Date(data[i].articleDate)} 
                };

                vm.successData.push(successItem);
            }
        }

    });

}]);