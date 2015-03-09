angular.module('home',[]).controller('HomeController', ['$scope', 'WordPressNg',
    function($scope, WordPress) {
        $scope.page = false;
        $scope.posts = false;

        // find the home page by its slug
        WordPress.findBySlug('wordpressngdemo.wordpress.com','home').then(function(post){
            $scope.page = post;
        });

        // find all of the posts that are tagged 'park'
        var params = {
            tags: ["parks"]
        };

        WordPress.posts('wordpressngdemo.wordpress.com', params).then(function(posts){
            console.log(posts);
            $scope.posts = posts;
        });
}]);