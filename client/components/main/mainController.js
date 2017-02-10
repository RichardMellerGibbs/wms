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

        if (mobileCheck()) {
            vm.deviceType = 'M';
        } else {
            vm.deviceType = 'D';
        }

        // call the Auth.login() function
        Auth.login(vm.username, vm.password, vm.deviceType)
        .success(function(data) {

            vm.processing = false;

            if (data.success) {
                // if a user successfully logs in, redirect to users page
                Log.logEntry('Maincontroller - successfully logged in');
                $location.path('/home');
            }
            else {
                Log.logEntry('Maincontroller - failed to log in data ' + data.message);
                //vm.error = data.message + ' Browser ' + vm.deviceType;
                vm.error = data.message
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

    // Find out the browser type
    function mobileCheck() {

        var isMobile = {
                Android: function() {
                    return navigator.userAgent.match(/Android/i);
                },
                BlackBerry: function() {
                    return navigator.userAgent.match(/BlackBerry/i);
                },
                iOS: function() {
                    return navigator.userAgent.match(/iPhone|iPad|iPod/i);
                },
                Opera: function() {
                    return navigator.userAgent.match(/Opera Mini/i);
                },
                Windows: function() {
                    return navigator.userAgent.match(/IEMobile/i);
                },
                any: function() {
                    return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
                }
            };

        if (isMobile.any()) {
            Log.logEntry('This is a mobile device');    
            return true;
        } else {
            Log.logEntry('This is NOT a mobile device. calling add to home screen');
            return false;
        }
    };
        
}]);