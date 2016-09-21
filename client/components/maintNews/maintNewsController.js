angular.module('maintNewsCtrl', ['authService','newsService','logService'])
.controller('maintNewsController', ['$rootScope', '$location', '$routeParams', '$window', 'Auth', 'News', 'Log',  
function($rootScope, $location, $routeParams, $window, Auth, News, Log) {  
    
    var vm = this;
    var newsId = '';
    
    vm.updateButton = true;
    vm.showDeleteSection = false;
    vm.addButton = false;
    vm.deleteButton = true;
    vm.closeButton = true;

    vm.articleDate = {};
    
    vm.errorType = 'Error!';
    vm.error = '';
    vm.feedback = '';
    
    Log.logEntry('Inside the maintNewsController.');


    vm.loggedIn = Auth.isLoggedIn();
    
    //Re-direct to login page if user no logged in
    if (vm.loggedIn === false) {
        $location.path('/login');  
    } else {
        
        //If a newstId is passed in the get the details of it
        
        if ($routeParams.newsId !== 'x') {
            vm.newsId = $routeParams.newsId;
                
            //Now get the news details for this article
            Log.logEntry('Now get the news details for this article ' + vm.newsId);
            
            News.get(vm.newsId)
            .success(function(data) {

                //console.log('maintEventController - success from Event.get ' + JSON.stringify(data));

                vm.article = data;
                
                vm.articleDate = {value: new Date(data.articleDate)};
                //console.log('event.picture = ' + vm.event.picture);
            })
            .error(function() {
                //console.log('maintEventController - failure from Event.get');
            });
        }
        else {
            //console.log('Called in add mode');
            
            //Default new article date to today
            vm.articleDate = {value: new Date()};

            //TURN OFF UPDATE AND DELETE BUTTONS AND LEAVE ON ADD BUTTON
            vm.updateButton = false;
            vm.addButton = true;
            vm.deleteButton = false;
        }    
    }


    /*************************************************************************/
    /* Add a news article */
    /*************************************************************************/
    vm.addNews = function() {
        
        vm.error = '';
        vm.feedback = '';
        
        //VALIDATE FORM
        if (!vm.article.title) {
            vm.error = 'A article title must be supplied';
            return;        
        }
        
        if (!vm.article.description) {
            vm.error = 'A article description must be supplied';
            return;        
        }
        
        var articletData = {
            articleDate: vm.articleDate.value,
            title: vm.article.title,
            description: vm.article.description
        };
              
        News.create(articletData)
        .success(function(data) {
            
            if (data.success === true) {
                vm.feedback = 'Article added';
                $location.path('/maintContent/news');
            } else {
                vm.error = data.message;
            }
                    
        });
    }

    /*************************************************************************/
    /* Update a news article */
    /*************************************************************************/
    vm.updateNews = function() {
        
        vm.error = '';
        vm.feedback = '';
        
        //VALIDATE FORM
        if (!vm.articleDate.value) {
            vm.error = 'A article date must be supplied';
            return;        
        }
        
        if (!vm.article.title) {
            vm.error = 'A article title must be supplied';
            return;        
        }
        
        if (!vm.article.description) {
            vm.error = 'A article description must be supplied';
            return;        
        }

        
        var articletData = {
            articleDate: vm.articleDate.value,
            title: vm.article.title,
            description: vm.article.description
            //snippet: vm.article.snippet
        };
        
        News.update(vm.newsId, articletData)
        .success(function(data) {
            
            if (data.success === true) {
                vm.feedback = 'Article updated';
                $location.path('/maintContent/news');
            } else {
                vm.error = data.message;
            }
                    
        });
    }


    /*************************************************************************/
    /* Delete confirmation section */
    /*************************************************************************/
    vm.confirmDelete = function() {
        //Turn off main buttons including the delete button just pressed
        vm.updateButton = false;
        vm.deleteButton = false;
        vm.addButton = false;
        
        //Turn on the delete confirmation buttons
        vm.showDeleteSection = true;
        vm.closeButton = false;
        
        //Show delete warning
        vm.error = 'This will delete the news article. Please confirm';
        vm.errorType = 'Warning!';
    }

    /*************************************************************************/
    /* Close the delete section on the form */
    /*************************************************************************/
    vm.closeDeleteSection = function() {
        //Turn on main buttons including the delete button just pressed
        vm.updateButton = true;
        vm.deleteButton = true;
        vm.addButton = false;
        
        //Turn off the delete confirmation buttons
        vm.showDeleteSection = false;
        vm.closeButton = true; 
        
        //Close delete warning
        vm.error = '';
        vm.errorType = 'Error!';
    }


    /*************************************************************************/
    /* Delete a news article */
    /*************************************************************************/
    vm.deleteNews = function() {
        
        vm.error = '';
        vm.feedback = '';
        
        if (!vm.newsId) {
            vm.error = 'No article specified';
            return;         
        }
        
        News.delete(vm.newsId)
        .success(function(data) {

            if (data.success === true) {
                vm.feedback = 'News article deleted';
            } else {
                vm.error = data.message;
            }
            
            $location.path('/maintContent/news');
        });
    }


    /*************************************************************************/
    /* Close the form and return back to the content management page */
    /*************************************************************************/
    vm.closeForm = function() {

        $location.path('/maintContent/news');    
    }

}]);