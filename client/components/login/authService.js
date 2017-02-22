angular.module('authService', ['storeageFallback','logService'])

// ===================================================
// Factory to login and get information

// inject $http for communicating with the API
// inject $q to return promise objects
// inject AuthToken to manage tokens
// ===================================================
.factory('Auth', function($http, $q, AuthToken, Browser) {

    // create auth factory object
    var authFactory = {};

    //Generate token and email 
    authFactory.forgotPassword = function(username) {

        //console.log('Auth factory - about to post authenticate request');
        // return the promise object and its data
        return $http.post('/api/forgot', {
            username: username
        })
        .success(function(data) {
            console.log('Auth factory - ' + data.message + ' and success = ' + data.success);
            
            return data;
        })
        .error(function() {
            console.log('Auth factory - failed to call forgot password ' + data.message);
        });
    };

    //Confirm token is still valid
    authFactory.checkForgotPassword = function(token) {

        return $http.get('/reset/' + token, {
        })
        .success(function(data) {
            console.log('Auth factory - ' + data.message + ' and success = ' + data.success);
            
            return data;
        })
        .error(function() {
            console.log('Auth factory - failed to call check reset token ' + data.message);
        });
    };

    //Reset the password for the token
    authFactory.resetPassword = function(token, password) {

        return $http.post('/reset/' + token, {
            password: password
        })
        .success(function(data) {
            console.log('Auth factory - ' + data.message + ' and success = ' + data.success);
            
            return data;
        })
        .error(function() {
            console.log('Auth factory - failed to reset password ' + data.message);
        });
    };

    // log a user in
    //console.log('Inside auth factory');
    authFactory.login = function(username, password, browser) {

        //console.log('Auth factory - about to post authenticate request');
        // return the promise object and its data
        return $http.post('/api/authenticate', {
            username: username,
            password: password,
            browser: browser
        })
        .success(function(data) {
            //console.log('Auth factory - ' + data.message + ' and success = ' + data.success);
            
            if (data.success) {
                AuthToken.setToken(data.token);
            };
            
            return data;
        })
        .error(function() {
            //console.log('Auth factory - failed to login. data ' + data.message);
        });
    };
    
    // log a user out by clearing the token
    authFactory.logout = function() {

        // clear the token
        AuthToken.setToken();
    };
    
    
    // check if a user is logged in
    // checks if there is a local token
    authFactory.isLoggedIn = function() {
        
        //Find out if tokenDate has expired and if so remove the token and return false.
        //This has the effect of logging the user out and forcing then to login again
        //It's a better experience allowing the homepage to display rather than taking them straight to the login
        //page if they launch the browser with an old token that has expired.
        
        var tokenDate = AuthToken.getTokenDate();
        
        if (tokenDate) {
            //Might need moment.js
            //Find out if this date has expired. Token lasts xxxx seconds
            //Has more than xxx seconds elapsed from the tokenDate?
            //If so then execute logout and return false.
            
            var now = new Date();
            var tokenDateTime = new Date(tokenDate);
            
            //console.log('tokenDateTime = ' + tokenDateTime + ' now = ' + now);
            
            var diff = now - tokenDateTime;
            var tokenAgeSeconds = Math.floor(diff / 1e3);
            
            var tokenExpiry = 18000;

            //console.log('tokenAge in seconds = ' + tokenAgeSeconds);
            //Check if the browser is a mobile type
            if (Browser.mobileCheck()) {
                tokenExpiry = 5184000 //2 months in seconds. 60 X 60 X 24 x 60
            } 
            
            if (tokenAgeSeconds > tokenExpiry) {
                // clear the token to logout
                AuthToken.setToken();      
            }
            
        } else {
            return false;
        }
        
        if (AuthToken.getToken())
            return true;
        else
            return false;
    };
    
    
    // get the logged in user
    authFactory.getUser = function() {
        //, { cache: true }
        if (AuthToken.getToken())     
            return $http.get('/api/me', { cache: true });
        else
            return $q.reject({ message: 'User has no token.' });
    };


    // Find out the browser type
    /*authFactory.mobileCheck = function() {

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
    */
    
    // return auth factory object
    return authFactory;

})


// ===================================================
// factory for handling obtaining browser type
// ===================================================
.factory('Browser', function($window, $localstorage, Log) {
    
    var browserFactory = {};

    browserFactory.mobileCheck = function() {
        
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
        
    return browserFactory;
})

// ===================================================
// factory for handling tokens

// inject $window to store token client-side
// ===================================================
.factory('AuthToken', function($window, $localstorage) {
    
    var authTokenFactory = {};

    // get the token out of local storage
    authTokenFactory.getToken = function() {
        //return $window.localStorage.getItem('token');
        return $localstorage.get('token');
    };
    
    // get the token date out of local storage
    authTokenFactory.getTokenDate = function() {
        //return $window.localStorage.getItem('tokenDate');
        return $localstorage.get('tokenDate');
    };
    
    
    // function to set token or clear token
    // if a token is passed, set the token
    // if there is no token, clear it from local storage
    authTokenFactory.setToken = function(token) {
        
        var tokenDate = new Date();
        
        if (token) {
            //$window.localStorage.setItem('token', token);
            //$window.localStorage.setItem('tokenDate', tokenDate.toISOString());
            
            $localstorage.set('token', token);
            $localstorage.set('tokenDate', tokenDate.toISOString());
        }
        else {
            //$window.localStorage.removeItem('token');
            //$window.localStorage.removeItem('tokenDate');
            
            $localstorage.remove('token');
            $localstorage.remove('tokenDate');
        }
    };
    
    return authTokenFactory;
})
    
    
// ===================================================
// application configuration to integrate token into requests
// ===================================================
.factory('AuthInterceptor', function($q, $location, AuthToken) {
    
    var interceptorFactory = {};

    // this will happen on all HTTP requests
    interceptorFactory.request = function(config) {

        // grab the token
        var token = AuthToken.getToken();

        // if the token exists, add it to the header as x-access-token
        if (token)
            config.headers['x-access-token'] = token;
            
        return config;
    };
    
    
    // happens on response errors
    interceptorFactory.responseError = function(response) {

        // if our server returns a 403 forbidden response
        if (response.status == 403)
            $location.path('/login');

        // return the errors from the server as a promise
        return $q.reject(response);
    };

    return interceptorFactory;

});