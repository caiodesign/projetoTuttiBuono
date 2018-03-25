app.config(['$stateProvider', '$urlRouterProvider', '$locationProvider', function ($stateProvider, $urlRouterProvider, $locationProvider) {

    $urlRouterProvider.otherwise('/home');
    $locationProvider.html5Mode(true).hashPrefix('!')

    $stateProvider
        .state('home', createRoute(
            'home', //APP URL
            'principals/header', //HEADER VIEW LOCATION
            'principals/footer', //FOOTER VIEW LOCATION
            'components/cadastro' //MAIN VIEW LOCATION
            
        ));
       /* .state('pacienteHome', createRoute(
            'paciente/home', //APP URL
            'headerPaciente', //HEADER VIEW LOCATION
            'footerSimple', //FOOTER VIEW LOCATION
            'paciente/homePacienteView' //MAIN VIEW LOCATION
        ));*/
}]);