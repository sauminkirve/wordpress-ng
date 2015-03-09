// this controller enables you to dynamically pull any page from your blog by its slug
// eg: /pages/how-it-works will look for the how-it-works page in the blog
angular.module('page',[]).controller('PageController', ['$scope',  '$routeParams', 'WordPressNg', function($scope, $routeParams, WordPress) {

    // we have to instantiate the post so angular will bind to it and listen for the actual data to come from wordpress
    $scope.post =  false;

    // this method finds the post by its wordpress slug
    WordPress.findBySlug('wordpressngdemo.wordpress.com', $routeParams['slug']).then(function(post){
        $scope.post = post;
    });
}]);