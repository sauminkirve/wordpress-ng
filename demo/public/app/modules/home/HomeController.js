angular.module('home',[]).controller('HomeController', ['$scope', 'WordPressNg',
    function($scope, WordPress) {
        $scope.page = false;

        // find the home page by its slug
        WordPress.findBySlug('wordpressngdemo.wordpress.com','home').then(function(post){
            $scope.page = post;
        });
}]);