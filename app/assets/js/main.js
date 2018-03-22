angular.module('distribuidora', ['ngRoute'])


.config(function($routeProvider) {
    $locationProvider.html5Mode(true); 
    
    $routeProvider.when('/home', {
        //headerUrl: xxxxxx,
        //footer: xxxxxx,
        //view:xxxx,
        templateUrl: 'views/components/cadastro.html',
        controller: 'FotosController'
    });

    $routeProvider.otherwise({redirectTo: '/home'});
}); 