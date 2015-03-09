angular.module('page',[]).controller('PageController', ['$scope',  '$routeParams', 'WordPressNg', function($scope, $routeParams, WordPress) {
    $scope.post =  false;

    // this method finds the post by its wordpress slug
    WordPress.findBySlug('wordpressngdemo.wordpress.com', $routeParams['slug']).then(function(post){
        $scope.post = post;
    });
}]);