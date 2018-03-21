angular.module('distribuidora', ['ngRoute'])


.config(function($routeProvider) {
    $locationProvider.html5Mode(true); 
    
    $routeProvider.when('/home', {
        templateUrl: 'partials/principal.html',
        controller: 'FotosController'
    });

    $routeProvider.otherwise({redirectTo: '/home'});
});