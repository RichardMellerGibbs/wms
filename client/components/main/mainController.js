//MAIN CONTROLLER - THE OUTER SHELL OF THE APPLICATION. THE SINGLE PAGE CONTROLLER
angular.module('mainCtrl', ['authService','logService'])
.controller('mainController', ['$rootScope', '$location', '$window', 'Auth', 'Log',  function($rootScope, $location, $window, Auth, Log) {

    var vm = this;
    Log.logEntry('Inside the main controller');

    // check to see if a user is logged in on every request
    $rootScope.$on('$routeChangeStart', function() {
        
        vm.loggedIn = Auth.isLoggedIn();

        vm.path = $location.path();
        Log.logEntry('Responding to route change. Path = ' + vm.path);

        if (vm.path === '') {
            return;
        }
    });

    // function to handle login form
    vm.doLogin = function() {

        Log.logEntry('Maincontroller - attempting login');
        vm.processing = true;
        // clear the error
        vm.error = '';

        if (!vm.username) {
            vm.error = 'Please enter a Username';
            return;
        }

        if (!vm.password) {
            vm.error = 'Please enter a password';
            return;
        }

        // call the Auth.login() function
        Auth.login(vm.username, vm.password)
        .success(function(data) {

            vm.processing = false;

            if (data.success) {
                // if a user successfully logs in, redirect to users page
                Log.logEntry('Maincontroller - successfully logged in');
                $location.path('/home');
            }
            else {
                Log.logEntry('Maincontroller - failed to log in data ' + data.message);
                vm.error = data.message;
            }
        })
        .error(function() {
            Log.logEntry('Maincontroller error ' + data.message);
            vm.error = data.message;
        });
    };

    // function to handle logging out
    vm.doLogout = function() {

        vm.error = '';
        vm.feedback = '';

        Log.logEntry('Maincontroller - attempting logout');
        Auth.logout();
        // reset all user info
        vm.user = {};
        $location.path('/home');
        $window.location.href = '/';
    };

    // function to handle forgot password
    vm.forgotPassword = function() {

        vm.error = '';
        vm.feedback = '';

        Log.logEntry('Maincontroller - forgot password');

        if (vm.username == undefined) {
            vm.error = 'Username must be supplied';
            return;    
        }

        Log.logEntry('vm.username ' + vm.username);

        // call the Auth.login() function
        Auth.forgotPassword(vm.username)
        .success(function(data) {

            vm.processing = false;

            if (data.success) {
                Log.logEntry('Maincontroller - successfully requested forgot');
                vm.feedback = 'An email has been sent to your mailbox containing further instructions';
            }
            else {
                Log.logEntry('Maincontroller - failed to request forgot ' + data.message);
                vm.error = data.message;
            }
        })
        .error(function() {
            Log.logEntry('Maincontroller error ' + data.message);
            vm.error = data.message;
        });
        
    };
        
}]);