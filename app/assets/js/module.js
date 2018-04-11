var app = angular.module("app", ['ui.router']);

var createRoute = function (URL, HEADER, FOOTER, MAIN, CONTROLLER) {
    return {
        url: '/' + URL,
        views: {
            'header': {
                templateUrl: '../views/' + HEADER + '.html',
                controller:  CONTROLLER
            },
            'main': {
                templateUrl: '../views/' + MAIN + '.html',
                controller: CONTROLLER
            },
            'footer': {
                templateUrl: '../views/' + FOOTER + '.html',
            }
        }
    }
}