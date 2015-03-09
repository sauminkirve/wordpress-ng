angular.module('appRoutes', []).config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {

    $routeProvider
        // home page
        .when('/', {
            templateUrl: 'app/modules/home/home.html',
            controller: 'HomeController'
        })
        // blog page
        .when('/page/:slug', {
            templateUrl: 'app/modules/page/page.html',
            controller: 'PageController'
        });

    $locationProvider.html5Mode(true);

}]);