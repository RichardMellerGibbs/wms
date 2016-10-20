//Angular application
"use strict";

(function () {

	angular.module('app', [
		'ngRoute',
        'mainCtrl',
        'homeCtrl',
		'resetCtrl',
		'maintContentCtrl',
		'maintNewsCtrl',
		'newsCtrl',
		'successCtrl',
		'maintSuccessCtrl',
		'maintTestCtrl',
		'angular-filepicker',
		'testimonialCtrl',
		'findUsCtrl'		
		])

	// application configuration to integrate token into requests
    .config(function($httpProvider) {

        // attach our auth interceptor to the http requests
        $httpProvider.interceptors.push('AuthInterceptor');
    })

	.config(['$routeProvider', '$locationProvider', 'filepickerProvider', function($routeProvider, $locationProvider, filepickerProvider) {
	
		$routeProvider

			//route for the home page
			.when('/', {
				templateUrl: 'components/home/home.html',
				controller: 'homeController',
				controllerAs: 'home'
			})

			.when('/home', {
				templateUrl: 'components/home/home.html',
				controller: 'homeController',
				controllerAs: 'home'
			})

			.when('/login', {
				templateUrl: 'components/login/login.html',
				controller: 'mainController',
				controllerAs: 'login'
			})

			.when('/reset/:token', {
				templateUrl: 'components/reset/reset.html',
				controller: 'resetController',
				controllerAs: 'reset'
			})

			.when('/maintContent/:tab', {
				templateUrl: 'components/maintContent/maintContent.html',
				controller: 'maintContentController',
				controllerAs: 'content'
			})

			.when('/maintNews/:newsId', {
				templateUrl: 'components/maintNews/maintNews.html',
				controller: 'maintNewsController',
				controllerAs: 'news'
			})

			.when('/maintSuccess/:successId', {
				templateUrl: 'components/maintSuccess/maintSuccess.html',
				controller: 'maintSuccessController',
				controllerAs: 'maintSuccess'
			})

			.when('/maintTestimonial/:testimonialId', {
				templateUrl: 'components/maintTestimonial/maintTest.html',
				controller: 'maintTestController',
				controllerAs: 'maintTestimonial'
			})

			.when('/news/:newsId', {
				templateUrl: 'components/news/news.html',
				controller: 'newsController',
				controllerAs: 'mainNews'
			})

			.when('/success', {
				templateUrl: 'components/success/success.html',
				controller: 'successController',
				controllerAs: 'success'
			})

			.when('/testimonial', {
				templateUrl: 'components/testimonial/testimonial.html',
				controller: 'testimonialController',
				controllerAs: 'testimonial'
			})

			.when('/findUs', {
				templateUrl: 'components/findUs/findUs.html',
				controller: 'findUsController',
				controllerAs: 'findUs'
			})
			
			.otherwise({redirectTo: '/home'
			
			});

			//Add the API key to use filestack service
        	filepickerProvider.setKey('AefnYNwSgmAycoGb9yH7Az');

			// use the HTML5 History API
			//This lets Angular change the routing and URLs of our pages without refreshing the page
	    	$locationProvider.html5Mode(true); 
	}])


	/* Filter to conver newlines added in test to <br> tags */
	.filter('newlines', function () {
		return function (item) {
			//return item.toUpperCase();
			return item.replace(/\n/g, '<br/>');
		}

	})

	/* This filter is used in conjunction with newlines above to allow the <br> to be interpreted */
	.filter('unsafe', function($sce) {
		return function(val) {
			return $sce.trustAsHtml(val);
		};
	})


})();	