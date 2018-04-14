var app = angular.module("app", ['ui.router']);
var createRoute = function (URL, HEADER, FOOTER, MAIN, mainController) {    
console.log("criou rota");
    
    return {
        url: '/' + URL,
        views: {
            'header': {
                templateUrl: '../views/' + HEADER + '.html',
                controller: mainController
            },
            'main': {
                templateUrl: '../views/' + MAIN + '.html',
                controller: mainController
            },
            'footer': {
                templateUrl: '../views/' + FOOTER + '.html',
            }
        }
    }
}