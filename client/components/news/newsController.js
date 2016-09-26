angular.module('newsCtrl', ['newsService','logService'])
.controller('newsController', ['$rootScope', '$location', '$routeParams', '$window', 'News', 'Log',  function($rootScope, $location, $routeParams, $window, News, Log) {  
    
    var vm = this;
    vm.newsData = [];
    var newsItem = {};

    Log.logEntry('Inside the newsController');

    News.all()
    .success(function(data) {

        Log.logEntry('news count ' + data.length);

        for (i=0; i < data.length; i++) {

            vm.picturePresent = false;

            if (data[i].picture) {
                vm.picturePresent = true;
            }

            newsItem = {
                    id: data[i]._id,
                    title: data[i].title,
                    description: data[i].description,
                    picture: data[i].picture,
                    picturePresent: vm.picturePresent,
                    articleDate: {value: new Date(data[i].articleDate)} 
            };

            vm.newsData.push(newsItem);
            
        }

    });

    /*
    var vm = this;

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
            
            Log.logEntry('news title ' + data.title);

            vm.newsData = [];
            var newsItem = {};

            newsItem = {
                    id: data._id,
                    title: data.title,
                    articleDate: data.articleDate,
                    description: data.description
            };

            vm.newsData.push(newsItem);
            
        })
        .error(function() {
            
        });

    } else {

        News.all()
        .success(function(newsData) {

            Log.logEntry('news all count ' + newsData.length);
            vm.newsData = newsData; 

        });
        
    }
    */

}]);