"use strict";

angular.module("confusionApp",["ngRoute"])
    .config(function($routeProvider) {
        $routeProvider
        
        // route for the contactus.html page
        .when('/contactus', {
            templateUrl : 'contactus.html',
            controller  : 'ContactController'
        })
        
        // route for the menu.html page
        .when('/menu', {
            templateUrl : 'menu.html',
            controller  : 'MenuController'
        })
        
        // route for the dishdetail.html page (all of them)
        .when('/menu/:id', {
            templateUrl : 'dishdetail.html',
            controller  : 'DishDetailController'
        })
        
        .otherwise('/contactus');
    })
;