//HOME PAGE CONTROLLER
angular.module('homeCtrl', ['contentService', 'newsService', 'logService'])
.controller('homeController', ['$location','Content', 'News', 'Log', function($location, Content, News, Log) {
  
    var vm = this;
    vm.errorType = 'Error!';

    Log.logEntry('Inside home controller');

    Content.all()
    .success(function(homeData) {

        Log.logEntry('homeController - success from Home.all number of entries ' + homeData.length);
    
        for (i=0; i<homeData.length; i++) {
        
            // Section 1
            if (homeData[i].subject === 'Section 1 Column 1 Paragraph 1') {
                vm.sec1Col1Par1 = homeData[i].description;         
            }

            if (homeData[i].subject === 'Section 1 Column 1 Paragraph 2') {
                vm.sec1Col1Par2 = homeData[i].description;  
            }

            if (homeData[i].subject === 'Section 1 Column 1 Paragraph 3') {
                vm.sec1Col1Par3 = homeData[i].description;  
            }

            if (homeData[i].subject === 'Section 1 Column 1 Paragraph 4') {
                vm.sec1Col1Par4 = homeData[i].description;  
            }

            // Section 2
            //Column 1
            if (homeData[i].subject === 'Section 2 Column 1 Paragraph 1') {
                vm.sec2Col1Par1 = homeData[i].description;  
            }

            if (homeData[i].subject === 'Section 2 Column 1 Paragraph 2') {
                vm.sec2Col1Par2 = homeData[i].description;  
            }

            if (homeData[i].subject === 'Section 2 Column 1 Paragraph 3') {
                vm.sec2Col1Par3 = homeData[i].description;  
            }

            //Column 2
            if (homeData[i].subject === 'Section 2 Column 2 Paragraph 1') {
                vm.sec2Col2Par1 = homeData[i].description;  
            }

            if (homeData[i].subject === 'Section 2 Column 2 Paragraph 2') {
                vm.sec2Col2Par2 = homeData[i].description;  
            }

            if (homeData[i].subject === 'Section 2 Column 2 Paragraph 3') {
                vm.sec2Col2Par3 = homeData[i].description;  
            }

            //Column 3
            if (homeData[i].subject === 'Section 2 Column 3 Paragraph 1') {
                vm.sec2Col3Par1 = homeData[i].description;  
            }

            if (homeData[i].subject === 'Section 2 Column 3 Paragraph 2') {
                vm.sec2Col3Par2 = homeData[i].description;  
            }

            if (homeData[i].subject === 'Section 2 Column 3 Paragraph 3') {
                vm.sec2Col3Par3 = homeData[i].description;  
            }
        }
    });

    Log.logEntry('homeController - Inbetween collecting data');
    Log.logEntry('homeController - showNewsDesc = ' + vm.showNewsDesc);

    News.all()
    .success(function(newsData) {

        Log.logEntry('homeController - success from News.all number of entries ' + newsData.length);

        vm.newsData = [];
        var newsItem = {};
        var shortDescription;
        var mobileDescription;
        var maxdisplaySize = 3; //Restrict home page news items to this number

        if (newsData.length < 3) {
            maxdisplaySize = newsData.length;
        }

        for (i=0; i<maxdisplaySize; i++) {

            //Shorten the description to show just a small amount of the full text
            if (newsData[i].description.length > 50) { 
                shortDescription = cutString(newsData[i].description,120) + '...';
                mobileDescription = cutString(newsData[i].description,80) + '...';
                //shortDescription = newsData[i].description.substring(0,150);
            } else {
                shortDescription = newsData[i].description;
            }
            
            newsItem = {
                    id: newsData[i]._id,
                    title: newsData[i].title,
                    articleDate: newsData[i].articleDate,
                    shortDescription: shortDescription
            };

            vm.newsData.push(newsItem);
        }

    });

    vm.newsDetail = function(newsItemId) {
        
        Log.logEntry('newsitemid ' + newsItemId);
        $location.path('/news/' + newsItemId);
    }

    /*************************************************************************/
    /* Return n characters but do not chop a word in half                    */
    /*************************************************************************/
    function cutString(s, n){
        var cut= s.indexOf(' ', n);
        if(cut== -1) return s;
        return s.substring(0, cut)
    }

}]);