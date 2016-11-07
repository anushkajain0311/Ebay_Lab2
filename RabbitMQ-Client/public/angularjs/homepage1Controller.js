"use strict";
var app= angular.module('Ebay', ['ui.router']);

app.config(function($stateProvider, $urlRouterProvider, $locationProvider){
	
	$urlRouterProvider.otherwise('/');
	$stateProvider
	.state('homepage',{
		url:'/',
		views:{
			'header@':{
				templateUrl: 'templates/header.ejs'
			},
			'content@': {
				templateUrl:'templates/homepageContent.ejs'
			}
		}
	})
	
	.state('women',{
		url:'/womenclothing',
		views:{
			'header@':{
				templateUrl:'templates/header.ejs'
			},
			'content@':{
				templateUrl:'templates/womenContent.ejs',
				controller:'addtocart'
			}
		}
	})

	.state('cart',{
		url:'/cart',
		views:{
			'header@':{
				templateUrl: 'templates/header.ejs'
			},
			'content@':{
				templateUrl:'templates/cartContent.ejs',
				controller:'getcart'
		
			}
		}
	})
	
	.state('checkout',{
		url:'/cart/checkout',
		views:{
			'content@':{
				templateUrl: 'templates/checkoutContent.ejs',
				controller:'getcart'
			}
		}
	})
	
	.state('transactionComplete',{
		url:'/cart/checkout/transactionComplete',
		views:{
			'header@': {
				templateUrl: 'templates/header.ejs'
			},
			'content@':{
				templateUrl: 'templates/complete.ejs'
			}
		}
	})
	
	.state('profile',{
		url:'/profile',
		views: {
			'header@': {
				templateUrl : 'templates/header.ejs'
			},
			'content@':{
				templateUrl: 'templates/profile.ejs',
				controller: 'profile'
			}
		}
	});
	
	//$locationProvider.html5Mode(true);
});
