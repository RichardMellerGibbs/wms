angular.module('successCtrl', ['successService','logService'])
.controller('successController', ['$rootScope', '$location', '$sce', '$routeParams', '$window', 'Success', 'Log', 
function($rootScope, $location, $sce, $routeParams, $window, Success, Log) {  
    
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

                //Make sure the URL starts with http://
                var urlText = data[i].articleUrl;
                var urlStart = '';
                var urlLink = '';

                if (urlText != undefined) {

                    urlStart = urlText.substring(0, 3);    
                
                    var urlValue = '';

                    if (urlStart == 'www') {
                        urlValue = 'http://' + data[i].articleUrl;
                    } else {
                        urlValue = data[i].articleUrl;
                    }

                    //Prepare the url string
                    var linkText = "<a href=" + urlValue + ">" + data[i].articleUrlDescription + "</a>";
                    //console.log('linkText ' + linkText);

                    //Mark the string as guaranteed html for angular
                    urlLink = $sce.trustAsHtml(linkText);
                }

                successItem = {
                        id: data[i]._id,
                        title: data[i].title,
                        description: data[i].description,
                        picture: data[i].picture,
                        picturePresent: vm.picturePresent,
                        articleDate: {value: new Date(data[i].articleDate)},
                        urlLink: urlLink
                };

                vm.successData.push(successItem);
            }
        }

    });

}]);