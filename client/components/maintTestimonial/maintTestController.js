angular.module('maintTestCtrl', ['authService','successService','logService'])
.controller('maintTestController', ['$rootScope', '$location', '$routeParams', '$window', 'Auth', 'Success', 'Log',  
function($rootScope, $location, $routeParams, $window, Auth, Success, Log) {  
    
    var vm = this;
    var testimonialId = '';
    
    vm.updateButton = true;
    vm.showDeleteSection = false;
    vm.addButton = false;
    vm.deleteButton = true;
    vm.closeButton = true;
    
    vm.errorType = 'Error!';
    vm.error = '';
    vm.feedback = '';

    vm.article = {};
    vm.articleDate = {};

    Log.logEntry('Inside the maintTestController');

    vm.loggedIn = Auth.isLoggedIn();
    
    //Re-direct to login page if user no logged in
    if (vm.loggedIn === false) {
        $location.path('/login');  
    } else {
        
        //If a testimonialId is passed in the get the details of it
        
        if ($routeParams.testimonialId !== 'x') {
            vm.testimonialId = $routeParams.testimonialId;
                
            //Now get the testimonial details for this article
            Log.logEntry('Now get the testimonial details for this article ' + vm.testimonialId);
            
            Success.get(vm.testimonialId)
            .success(function(data) {

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

            //Default new article date to today
            vm.articleDate = {value: new Date()};
            
            //TURN OFF UPDATE AND DELETE BUTTONS AND LEAVE ON ADD BUTTON
            vm.updateButton = false;
            vm.addButton = true;
            vm.deleteButton = false;
        }    
    }


    /*************************************************************************/
    /* Add a testimonial article */
    /*************************************************************************/
    vm.addTestimonial = function() {
        
        vm.error = '';
        vm.feedback = '';

        Log.logEntry('Adding testimonial');

        // COMMON VALIDATION
        if (!vm.article.description) {
            vm.error = 'A article description must be supplied';
            return;        
        }

        if (!vm.articleDate.value) {
            vm.error = 'A article date must be supplied';
            return;        
        }

        if (!vm.article.by) {
            vm.error = 'A article author must be supplied';
            return;        
        }

        if (!vm.article.articleUrl && vm.article.articleUrlDescription) {
            vm.error = 'A article URL must be supplied if a URL description is present';
            return;        
        }
        
        var articletData = {
            type: 'testimonial',
            articleDate: vm.articleDate.value,
            description: vm.article.description,
            by: vm.article.by,
            articleUrl: vm.article.articleUrl,
            articleUrlDescription: vm.article.articleUrlDescription
        };
              
        Success.create(articletData)
        .success(function(data) {
            
            if (data.success === true) {
                vm.feedback = 'Article added';
                $location.path('/maintContent/testimonial');
            } else {
                vm.error = data.message;
            }
                    
        });
        
    }

    /*************************************************************************/
    /* Update a testimonial article */
    /*************************************************************************/
    vm.updateTestimonial = function() {
        
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

        if (!vm.article.by) {
            vm.error = 'A article author must be supplied';
            return;        
        }

        if (!vm.article.articleUrl && vm.article.articleUrlDescription) {
            vm.error = 'A article URL must be supplied if a URL description is present';
            return;        
        }
        
        // LOAD UP THE OBJECT
        var articletData = {
            articleDate: vm.articleDate.value,
            description: vm.article.description,
            by: vm.article.by,
            articleUrl: vm.article.articleUrl,
            articleUrlDescription: vm.article.articleUrlDescription
        };

        Success.update(vm.testimonialId, articletData)
        .success(function(data) {
            
            if (data.success === true) {
                vm.feedback = 'Article updated';
                $location.path('/maintContent/testimonial');
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
        vm.error = 'This will delete the testimonial article. Please confirm';
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
    vm.deleteTestimonial = function() {
        
        vm.error = '';
        vm.feedback = '';
        
        if (!vm.testimonialId) {
            vm.error = 'No article specified';
            return;         
        }
        
        Success.delete(vm.testimonialId)
        .success(function(data) {

            if (data.success === true) {
                vm.feedback = 'Testimonial article deleted';
            } else {
                vm.error = data.message;
            }
            
            $location.path('/maintContent/testimonial');
        });
    }


    /*************************************************************************/
    /* Close the form and return back to the content management page */
    /*************************************************************************/
    vm.closeForm = function() {

        $location.path('/maintContent/testimonial');
    }

}]);