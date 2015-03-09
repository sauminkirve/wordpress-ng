angular.module('blog',[]).controller('BlogController', ['$scope', 'WordPressNg', function($scope, WordPress) {
    $scope.posts = false;

    // find all of the posts that are tagged 'park'
    var params = {
        tags: ["parks"]
    };

    WordPress.posts('wordpressngdemo.wordpress.com', params).then(function(posts){
        console.log(posts);
        $scope.posts = posts;
    });
}]);