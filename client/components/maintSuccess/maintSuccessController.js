angular.module('maintSuccessCtrl', ['authService','successService','logService'])
.controller('maintSuccessController', ['$rootScope', '$location', '$routeParams', '$window', 'Auth', 'Success', 'Log',  
function($rootScope, $location, $routeParams, $window, Auth, Success, Log) {  
    
    var vm = this;
    var newsId = '';
    
    vm.updateButton = true;
    vm.showDeleteSection = false;
    vm.addButton = false;
    vm.deleteButton = true;
    vm.closeButton = true;
    
    vm.errorType = 'Error!';
    vm.error = '';
    vm.feedback = '';
    vm.articleType = 'Success/Testimonial';
    vm.showType = false;
    vm.showTitle = true;
    vm.article = {};
    vm.articleDate = {};

    
    Log.logEntry('Inside the maintSuccessController.');

    vm.loggedIn = Auth.isLoggedIn();
    
    //Re-direct to login page if user no logged in
    if (vm.loggedIn === false) {
        $location.path('/login');  
    } else {
        
        //If a successtId is passed in the get the details of it
        
        if ($routeParams.successId !== 'x') {
            vm.successId = $routeParams.successId;
                
            //Now get the success details for this article
            Log.logEntry('Now get the success details for this article ' + vm.successId);
            
            Success.get(vm.successId)
            .success(function(data) {

                //console.log('maintEventController - success from Event.get ' + JSON.stringify(data));

                vm.article = data;
                
                vm.articleDate = {value: new Date(data.articleDate)};

                Log.logEntry('vm.article.type = ' + vm.article.type);

            })
            .error(function() {
                //console.log('maintEventController - failure from Event.get');
            });
        }
        else {
            //console.log('Called in add mode');

            //vm.showType = true;
            //Default new article date to today
            vm.articleDate = {value: new Date()};
            
            //TURN OFF UPDATE AND DELETE BUTTONS AND LEAVE ON ADD BUTTON
            vm.updateButton = false;
            vm.addButton = true;
            vm.deleteButton = false;
        }    
    }


    /*************************************************************************/
    /* Add a success article */
    /*************************************************************************/
    vm.addSuccess = function() {
        
        vm.error = '';
        vm.feedback = '';
        var type = '';

        // COMMON VALIDATION
        if (!vm.article.description) {
            vm.error = 'A article description must be supplied';
            return;        
        }

        if (!vm.articleDate.value) {
            vm.error = 'A article date must be supplied';
            return;        
        }

        if (!vm.article.title) {
            vm.error = 'A article title must be supplied';
            return;        
        }

        var articletData = {
            type: 'success',
            title: vm.article.title,
            articleDate: vm.articleDate.value,
            description: vm.article.description
        };
        
        if (vm.articleTypeChosen === 'success') {
            articletData.title = vm.article.title;    
        }

        if (vm.articleTypeChosen === 'testimonial') {
            articletData.by = vm.article.by;    
        }

        if (vm.article.picture) {
            articletData.picture = vm.article.picture;
        }

        Log.logEntry('article title '+ articletData.title);
        Log.logEntry('article by '+ articletData.by);

              
        Success.create(articletData)
        .success(function(data) {
            
            if (data.success === true) {
                vm.feedback = 'Article added';
                $location.path('/maintContent/success');
            } else {
                vm.error = data.message;
            }
                    
        });
        
    }

    /*************************************************************************/
    /* Update a success article */
    /*************************************************************************/
    vm.updateSuccess = function() {
        
        vm.error = '';
        vm.feedback = '';

        // COMMON VALIDATION
        if (!vm.article.description) {
            vm.error = 'A article description must be supplied';
            return;        
        }

        if (!vm.articleDate.value) {
            vm.error = 'A article date must be supplied';
            return;        
        }

        if (!vm.article.title) {
            vm.error = 'A article title must be supplied';
            return;        
        }

        // LOAD UP THE OBJECT
        var articletData = {
            articleDate: vm.articleDate.value,
            description: vm.article.description,
            title: vm.article.title
        };
            
        if (vm.article.picture) {
            articletData.picture = vm.article.picture;
        }
        
        Success.update(vm.successId, articletData)
        .success(function(data) {
            
            if (data.success === true) {
                vm.feedback = 'Article updated';
                $location.path('/maintContent/success');
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
        vm.error = 'This will delete the success article. Please confirm';
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
    /* Delete a success article */
    /*************************************************************************/
    vm.deleteSuccess = function() {
        
        vm.error = '';
        vm.feedback = '';
        
        if (!vm.successId) {
            vm.error = 'No article specified';
            return;         
        }
        
        Success.delete(vm.successId)
        .success(function(data) {

            if (data.success === true) {
                vm.feedback = 'Success article deleted';
            } else {
                vm.error = data.message;
            }
            
            $location.path('/maintContent/success');
        });
    }


    /*************************************************************************/
    /* Close the form and return back to the content management page */
    /*************************************************************************/
    vm.closeForm = function() {
        $location.path('/maintContent/success');
    }

    /*************************************************************************/
    /* Image upload to filepicer */
    /*************************************************************************/
    vm.imageUpload = function(){
        
       //console.log('Trying to pick an image');
            
        //filepicker.pick(picker_options, onSuccess(Blob){}, onError(FPError){}, onProgress(FPProgress){})
        filepicker.pick(
            {
                mimetype: 'image/*',
                language: 'en',
                services: ['COMPUTER','DROPBOX','GOOGLE_DRIVE','IMAGE_SEARCH', 'FACEBOOK', 'INSTAGRAM'],
                openTo: 'IMAGE_SEARCH',
                imageMax: [800, 800]
            },
            function(Blob){
                //console.log(JSON.stringify(Blob));
                //console.log('success from pick');
                //console.log(JSON.stringify(Blob));
                vm.article.picture = Blob.url;
                //console.log('vm.event.picture ' + vm.event.picture);
                //vm.$apply();
            },
            function(error){
                Log.logEntry('failure from pick');
                //console.log(error.toString()); 
            }
        );
    };

}]);