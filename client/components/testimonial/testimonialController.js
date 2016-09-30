angular.module('testimonialCtrl', ['successService','logService'])
.controller('testimonialController', ['$rootScope', '$location', '$sce', '$routeParams', '$window', 'Success', 'Log', 
function($rootScope, $location, $sce, $routeParams, $window, Success, Log) {  
    
    var vm = this;

    vm.testData = [];
    var testItem = {};

    Log.logEntry('Inside the testimonialController');

    Success.all()
    .success(function(data) {

        Log.logEntry('testimonial count ' + data.length);

        for (i=0; i < data.length; i++) {

            if (data[i].type === 'testimonial') {

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

                testItem = {
                        id: data[i]._id,
                        by: data[i].by,
                        description: data[i].description,
                        urlLink: urlLink
                };

                vm.testData.push(testItem);
            }
            
        }

    });

}]);