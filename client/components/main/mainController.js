//MAIN CONTROLLER - THE OUTER SHELL OF THE APPLICATION. THE SINGLE PAGE CONTROLLER
angular.module('mainCtrl', ['authService','logService','spaContentService'])
.controller('mainController', ['$rootScope', '$location', '$window', 'Auth', 'Log', 'Browser', 'SpaContent',  function($rootScope, $location, $window, Auth, Log, Browser, SpaContent) {

    var vm = this;
    Log.logEntry('Inside the main controller');

    SpaContent.all('Footer')
    .success(function(footerData) {

        Log.logEntry('mainController - success from SpaContent.all number of entries ' + footerData.length);
        Log.logEntry('mainController - SpaContent[0] ' + footerData[0].subject + ' ' + footerData[0].description);

        for (i=0; i<footerData.length; i++) {
            
            if (footerData[i].subject === 'Footer Address Line 1') {
                vm.addressLine1 = footerData[i].description;
            }

            if (footerData[i].subject === 'Footer Address Line 2') {
                vm.addressLine2 = footerData[i].description;
            }

            if (footerData[i].subject === 'Footer Address Line 3') {
                vm.addressLine3 = footerData[i].description;
            }

            if (footerData[i].subject === 'Footer Address Line 4') {
                vm.addressLine4 = footerData[i].description;
            }

            if (footerData[i].subject === 'Footer Office Phone') {
                vm.officePhone = footerData[i].description;
            }

            if (footerData[i].subject === 'Footer Fax') {
                vm.officeFax = footerData[i].description;
            }

            if (footerData[i].subject === 'Footer Office Email') {
                vm.officeEmail = footerData[i].description;
            }

            if (footerData[i].subject === 'Footer First Contact Name') {
                vm.firstContactName = footerData[i].description;
            }

            if (footerData[i].subject === 'Footer First Contact Phone') {
                vm.firstContactPhone = footerData[i].description;
            }

            if (footerData[i].subject === 'Footer First Contact Email') {
                vm.firstContactEmail = footerData[i].description;
            }

            if (footerData[i].subject === 'Footer Second Contact Name') {
                vm.secondContactName = footerData[i].description;
            }

            if (footerData[i].subject === 'Footer Second Contact Phone') {
                vm.secondContactPhone = footerData[i].description;
            }

            if (footerData[i].subject === 'Footer Second Contact Email') {
                vm.secondContactEmail = footerData[i].description;
            }
        }
    });

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

        Log.logEntry('Getting the browser type');

        if (Browser.mobileCheck()) {
            vm.deviceType = 'M';
        } else {
            vm.deviceType = 'D';
        }

        Log.logEntry('Getting the browser type = ' + vm.deviceType);

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
        
}]);