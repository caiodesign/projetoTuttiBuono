app.config(['$stateProvider', '$urlRouterProvider', '$locationProvider', function ($stateProvider, $urlRouterProvider, $locationProvider) {
    console.log("1");

    $urlRouterProvider.otherwise('/home');
    $locationProvider.html5Mode(true).hashPrefix('!')

    $stateProvider
        .state('home', createRoute(
            'home', //APP URL
            'principals/header/header', //HEADER VIEW LOCATI ON
            'principals/footer', //FOOTER VIEW LOCATION
            'complete/home-view' //MAIN VIEW LOCATION
            
        ))
        .state('cadastro', createRoute(
            'cadastro', //APP URL
            'principals/header/header', //HEADER VIEW LOCATION
            'principals/footer', //FOOTER VIEW LOCATION
            'components/cadastro', //MAIN VIEW LOCATION
            'controller/produto-controller' //MAIN CONTROLLER
        ))
        .state('lixo', createRoute(
            'lixo', //APP URL
            'principals/header/header', //HEADER VIEW LOCATION
            'principals/footer', //FOOTER VIEW LOCATION
            'components/post' //MAIN VIEW LOCATION
            
        ));
}]);