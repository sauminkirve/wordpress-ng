angular.module('appRoutes', []).config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {

    $routeProvider
        // home page
        .when('/', {
            templateUrl: 'app/modules/home/home.html',
            controller: 'HomeController'
        })
        // blog page
        .when('/blog', {
            templateUrl: 'app/modules/blog/blog.html',
            controller: 'BlogController'
        });

    $locationProvider.html5Mode(true);

}]);