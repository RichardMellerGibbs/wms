angular.module('maintUserCtrl', ['authService','logService', 'userService'])
.controller('maintUserController', ['$rootScope', '$location', '$routeParams', '$window', 'Auth', 'Log', 'User',  
function($rootScope, $location, $routeParams, $window, Auth, Log, User) {  

    var vm = this;

    vm.errorType = 'Error!';
    vm.error = '';
    vm.feedback = '';
    vm.add = false;
    vm.enablePassword = false;
    vm.showAdmin = false;
    vm.showPasswordLink = false;

    vm.updateButton = true;
    vm.showDeleteSection = false;
    vm.addButton = false;
    vm.deleteButton = true;
    vm.closeButton = true;

    Log.logEntry('Inside the maintUserController');

    vm.loggedIn = Auth.isLoggedIn();
    
    //Re-direct any attempt to use this controller if not logged in.
    if (vm.loggedIn === false){
        $location.path('/login');  
    }

    //Find the logged in user
    Auth.getUser().success(function(data) {

            Log.logEntry('maintUserController - success from Auth.getUser userid = ' + data.userid + ' name ' + data.username + ' admin ' + data.admin);

            // bind the data that come back to vm.user
            vm.me = data;
            Log.logEntry('logged in user is ' + vm.me.username);
            
            if (vm.me.admin === true) {
                //This is an admin user
                vm.showAdmin = true;
                vm.deleteButton = true;
            } else {
                //ordinary users cannot delete other users or themselves
                vm.deleteButton = false;
            }

            //Ensures only the logged in user can change their password and noone elses
            if (vm.me.userid === $routeParams.userId) {
                Log.logEntry('Looking at my account');
                vm.showPasswordLink = true;
            }
    });

    if ($routeParams.userId !== 'x') {

        //Updating a user
        vm.userId = $routeParams.userId;
        vm.add = false;
        vm.enablePassword = false;

        Log.logEntry('Getting detail for user ' + $routeParams.userId);
        
        User.get($routeParams.userId).success(function(data) {
            Log.logEntry('Got detail for user name ' + data.username);

            vm.username = data.username;
            vm.firstName = data.firstName;
            vm.surname = data.surname;
            vm.admin = data.admin;
        });
    } else {

        //Adding a user
        vm.add = true;
        //TURN OFF UPDATE AND DELETE BUTTONS AND LEAVE ON ADD BUTTON
        vm.updateButton = false;
        vm.addButton = true;
        vm.deleteButton = false;

        vm.enablePassword = true;
    }


    /*************************************************************************/
    /* Enable the password fields */
    /*************************************************************************/
    vm.changePassword = function() {
        vm.enablePassword = true;
    }

    /*************************************************************************/
    /* Close the form and return back to the calling page */
    /*************************************************************************/
    vm.closeForm = function() {
        $location.path('/user');
    }

    /*************************************************************************/
    /* Update a user */
    /*************************************************************************/
    vm.updateUser = function() {
        
        vm.error = '';
        vm.feedback = '';

        // COMMON VALIDATION
        if (!vm.firstName) {
            vm.error = 'First name must be supplied';
            return;        
        }

        if (!vm.surname) {
            vm.error = 'Surname must be supplied';
            return;        
        }

        if (!vm.username) {
            vm.error = 'Email must be supplied';
            return;        
        }

        //Make sure I can only change my password
        //if the password has been changed
        if (vm.password !== undefined) {
        
            Log.logEntry('maintUserController password changed');
            if (!vm.passwordAgain) {
                vm.error = 'Please confirm your password';
                return;
            }
            
            if (vm.password !== vm.passwordAgain) {
                vm.error = 'The passwords do not match';
                return;
            }
        }

        var customer = false;
        Log.logEntry('maintController Admin ' + vm.admin);

        // LOAD UP THE OBJECT
        var userData = {
            firstName: vm.firstName,
            surname: vm.surname,
            username: vm.username,
            customer: customer,
            admin: vm.admin
        };

        //add password if changed
        if (vm.password !== undefined) {
            userData.password = vm.password;
        }
            
        User.update(vm.userId, userData)
        .success(function(data) {
            
            if (data.success === true) {
                vm.feedback = 'User updated';
                $location.path('/user');
            } else {
                vm.error = data.message;
            }
                    
        });
    }

    /*************************************************************************/
    /* Add a user */
    /*************************************************************************/
    vm.addUser = function() {
        
        vm.error = '';
        vm.feedback = '';
        var admin = false;

        if (vm.admin !== undefined) {
            admin = vm.admin;
        }

        // COMMON VALIDATION
        if (!vm.firstName) {
            vm.error = 'First name must be supplied';
            return;        
        }

        if (!vm.surname) {
            vm.error = 'Surname must be supplied';
            return;        
        }

        if (!vm.username) {
            vm.error = 'Email must be supplied';
            return;        
        }

        if (!vm.password) {
            vm.error = 'Please enter a password';
            return;
        }
        
        if (!vm.passwordAgain) {
            vm.error = 'Please confirm your password';
            return;
        }
        
        if (vm.password !== vm.passwordAgain) {
            vm.error = 'The passwords do not match';
            return;
        }

        var customer = false;
        Log.logEntry('maintController Admin ' + vm.admin);

        //Does the email address already exist
        User.getName(vm.username)
        .success(function(data) {

            if (data.success === true) {
                if (data.message === 'EXISTS') {
                    vm.error = 'A member with that email address already exists';
                    return;        
                } else {
                    Log.logEntry('Form is valid');
                    // LOAD UP THE OBJECT
                    var userData = {
                        firstName: vm.firstName,
                        surname: vm.surname,
                        username: vm.username,
                        customer: false,
                        admin: admin,
                        password: vm.password
                    };

                    User.create(userData)
                    .success(function(data) {
                        
                        if (data.success === true) {
                            vm.feedback = 'User added';
                            $location.path('/user');
                        } else {
                            vm.error = data.message;
                        }
                                
                    });
                }
            }
        });
    }

    /*************************************************************************/
    /* Confirm delete a user */
    /*************************************************************************/
    vm.confirmDelete = function() {
        
        vm.error = '';
        vm.feedback = '';
        
        //Turn off main buttons including the delete button just pressed
        vm.updateButton = false;
        vm.deleteButton = false;
        
        //Turn on the delete confirmation buttons
        vm.showDeleteSection = true;
        
        //Show delete warning
        vm.error = 'This will delete the user. Please confirm';
        vm.errorType = 'Warning!';
    }

    /*************************************************************************/
    /* Close the delete section */
    /*************************************************************************/
    vm.closeDeleteSection = function() {
        
        vm.error = '';
        vm.feedback = '';
        
        //Turn on main buttons including the delete button just pressed
        vm.updateButton = true;
        vm.deleteButton = true;
        
        //Turn off the delete confirmation buttons
        vm.showDeleteSection = false; 
        
        //Close delete warning
        vm.error = '';
        vm.errorType = 'Error!';
    }


    /*************************************************************************/
    /* Delete the user */
    /*************************************************************************/
    vm.deleteUser = function(userId) {
                
        // clear the error
        vm.error = '';
        vm.feedback = '';
        
        Log.logEntry('maintUserController - attempting delete of user ' + userId);
        
        User.delete(userId)
        .success(function(data) {

            Log.logEntry('(data.success ' + (data.success));

            if (data.success === true) {
                vm.feedback = 'User deleted';
                $location.path('/user');
            } else {
                vm.error = data.message;
            }
            
            /*if (vm.me.username === vm.member.username) {
                //log me out as ive just deleted myself and take me to the home page
                Auth.logout();
                $location.path('/home');
            } else {
                //im deleting someone else.
                //if im admin take me to all members otherwise back to home
                if (vm.me.admin === true) {
                    $location.path('/user');        
                } else {
                    $location.path('/home');        
                }
            }*/
            
        });
    }
   
    
}]);