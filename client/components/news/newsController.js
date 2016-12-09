angular.module('newsCtrl', ['newsService','logService'])
.controller('newsController', ['$rootScope', '$location', '$sce', '$routeParams', '$window', 'News', 'Log',  
function($rootScope, $location, $sce, $routeParams, $window, News, Log) {  
        
    var vm = this;
    vm.newsData = [];
    var newsItem = {};

    Log.logEntry('Inside the newsController. Routeparam = ' + $routeParams.newsId);

    if ($routeParams.newsId !== 'x') {
        
        vm.newsId = $routeParams.newsId;

        //Now get the news details for this article
        Log.logEntry('Now get the news details for this article ' + vm.newsId);
        
        News.get(vm.newsId)
        .success(function(data) {

            //Notice that a single item returned from the database does not arrive as an array.
            //This is why an array is built here containing the news item object. This allows
            //both a dingle news article and multiple articles to be treated or displayed In the same way.

            vm.picturePresent = false;

            if (data.picture) {
                vm.picturePresent = true;
            }

            Log.logEntry('About to check the article url');

            //Make sure the URL starts with http://
            var urlText = data.articleUrl;
            var urlLink = '';
            var urlStart = '';
            
            Log.logEntry('About to run the url section');

            if (urlText != undefined) {

                urlStart = urlText.substring(0, 3);    
            
                var urlValue = '';

                if (urlStart == 'www') {
                    urlValue = 'http://' + data.articleUrl;
                } else {
                    urlValue = data.articleUrl;
                }

                //Prepare the url string
                var linkText = "<a href=" + urlValue + ">" + data.articleUrlDescription + "</a>";

                //Mark the string as guaranteed html for angular
                urlLink = $sce.trustAsHtml(linkText);
            }

            newsItem = {
                    id: data._id,
                    title: data.title,
                    description: data.description,
                    picture: data.picture,
                    picturePresent: vm.picturePresent,
                    articleDate: {value: new Date(data.articleDate)},
                    urlLink: urlLink 
            };

            vm.newsData.push(newsItem);
            
        })
        .error(function() {
            
        });

    } else {

        News.all()
        .success(function(data) {

            Log.logEntry('news count ' + data.length);

            for (i=0; i < data.length; i++) {

                vm.picturePresent = false;

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

                    //Mark the string as guaranteed html for angular
                    urlLink = $sce.trustAsHtml(linkText);
                }

                //Log.logEntry('news article date ' + data[i].articleDate);
                

                newsItem = {
                        id: data[i]._id,
                        title: data[i].title,
                        description: data[i].description,
                        picture: data[i].picture,
                        picturePresent: vm.picturePresent,
                        articleDate: {value: new Date(data[i].articleDate)},
                        urlLink: urlLink  
                };

                Log.logEntry('news article date ' + newsItem.articleDate.value);

                vm.newsData.push(newsItem);
                
            }

        });
        
    }
    

}]);