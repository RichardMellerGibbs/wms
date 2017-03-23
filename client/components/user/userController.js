angular.module('userCtrl', ['authService','logService', 'userService'])
.controller('userController', ['$rootScope', '$location', '$routeParams', '$window', 'Auth', 'Log', 'User',  
function($rootScope, $location, $routeParams, $window, Auth, Log, User) {  

    var vm = this;

    Log.logEntry('Inside the userController');

    vm.loggedIn = Auth.isLoggedIn();
    
    //Re-direct any attempt to use this controller if not logged in.
    if (vm.loggedIn === false){
        $location.path('/login');  
    }

    Log.logEntry('Get all the users');
    
     User.all().success(function(userData) {

        vm.users = userData;

     });

    /*************************************************************************/
    /* maintain a user */
    /*************************************************************************/
    vm.userDetail = function(user) {
                
        Log.logEntry('Calling maintUser ' + user.name);
        
        $location.path('/maintUser/' + user._id);
    }

    /*************************************************************************/
    /* add a user */
    /*************************************************************************/
    vm.addUser = function() {
                
        $location.path('/maintUser/x');
    }


}]);