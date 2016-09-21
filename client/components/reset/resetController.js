//RESET CONTROLLER - FOR PASSWORD RESET
angular.module('resetCtrl', ['authService','logService'])
.controller('resetController', ['$rootScope', '$location', '$window', '$routeParams', 'Auth', 'Log',  function($rootScope, $location, $window, $routeParams, Auth, Log) {

    var vm = this;
    vm.error = '';

    Log.logEntry('Inside the reset controller');

    vm.token = $routeParams.token;
    Log.logEntry('Token = ' + vm.token);

    //Now validate the token is ok oterwise generate error
    Auth.checkForgotPassword(vm.token)
    .success(function(data) {

        vm.processing = false;

        if (data.success) {
            Log.logEntry('ResetController - successfully checked token');
        }
        else {
            Log.logEntry('ResetController - failed to validate token ' + data.message);
            vm.error = data.message;
        }
    })
    .error(function() {
        Log.logEntry('ResetController error ' + data.message);
        vm.error = data.message;
    });


    //http://localhost:8083/#/reset/fb580cee3934314c2309056e58cb319d3b9dd683
    // function to handle resetting the password
    vm.resetPassword = function() {

        vm.error = '';
        vm.feedback = '';

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

        Log.logEntry('Resetcontroller - reset password. Token ' + vm.token);

        Auth.resetPassword(vm.token, vm.password)
        .success(function(data) {

            vm.processing = false;

            if (data.success) {
                Log.logEntry('Maincontroller - successfully requested forgot');
                vm.feedback = 'Your password has been successfully reset. Please login';
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