# WordPress-NG

This project is an AngularJS service that integrates AngularJS projects with the public WordPress.com REST API.

## Installation

Bower:

```shell
bower install wordpress-ng
```

# Usage

```javascript
angular.module('myApp', ['wordpress-ng']);
```

## Fetching Posts

The `posts()` method queries the posts WordPress resource. You can pass it any of the query parameters listed on in the
[docs page](https://developer.wordpress.com/docs/api/1.1/get/sites/%24site/posts/).

    WordPress.posts('wordpressngdemo.wordpress.com').then(function(posts){
        // do something with the posts
    });

### Find posts by tags

A very common use case is finding a list of posts by tag or tags. WordPressNG adds the ability to query by a set of tags.

    var params = {
        tags: ["parks", "featured"] // find all featured parks
    };

    WordPress.posts('wordpressngdemo.wordpress.com', params).then(function(posts){
        // do something with the posts
    });

## Finding a Specific Post

You can find a specific post by ID or WordPress slug.

    var id = 18; // sequoia
    WordPress.find('wordpressngdemo.wordpress.com', id).then(function(post){
        // do something with the post
    });

The demo site has an example of using the findBySlug() method dynamically.

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

## Debugging

Debugging can be an inevitable part of integrating data. You can turn the debug flag to true for each of these methods.
The service will then log key details about the request and response to the console.

## Caching

Caching is turned on by default. If you are having trouble debugging it might be helpful to turn it off:

    WordPress.cacheEnabled = false;

# Issues and Suggestions

Please log any issues that you encounter in the [Github issue tracker](https://github.com/forrestLyman/wordpress-ng/issues).
