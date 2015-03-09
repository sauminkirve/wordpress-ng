angular.module('wordpress-ng', []).factory('WordPressNg', ['$http', '$q', '$sce', function($http, $q, $sce) {
    $http.defaults.useXDomain = true;

    return {
        /**
         * This is the root endpoint for the public wordpress.com api
         */
        apiRoot: 'https://public-api.wordpress.com/rest/v1',

        /**
         * Post preparation options
         */
        postOptions: {
            createTextField: true, // creates a text version of the content
            trustContent: true // explicitly trusts the excerpt + content fields in the wordpress response
        },

        /**
         * Cache the wordpress api responses
         */
        cacheEnabled: true,

        /**
         * List the posts from a blog
         *
         * This method returns a promise, resolving an array of posts once wordpress.com returns them
         *
         * @param blog
         *        The wordpress.com domain of the blog, for example: forrestlyman.wordpress.com
         *
         * @param params
         *        An array of any valid query parameters from the posts endpoint: https://developer.wordpress.com/docs/api/1.1/get/sites/%24site/posts/
         *        This method additionally adds the following parameters:
         *            tags: an array of tags
         *
         * @params debug
         *         If this is set to true the request params and response posts will be logged to the console
         */
        posts: function(blog, params, debug) {
            var wp = this;
            return $q(function(resolve, reject) {
                // join the tags if they are set
                if(params && params.tags) {
                    if(params.tags) {
                        params.tag = params.tags.join('+');
                    }
                }

                // log the params to the console if we are in debug mode
                if(debug) {
                    console.log(params);
                }

                $http.get(wp.apiRoot + '/sites/' + blog + '/posts', {params: params, cache: wp.cacheEnabled}).success(function(res){
                    // we add a text version of the content to the post object
                    angular.forEach(res.posts, function(post){
                        wp._preparePost(post);
                    });

                    // log the posts to the console if we are in debug mode
                    if(debug) {
                        console.log(res.posts);
                    }

                    // resolve the promise with the posts
                    resolve(res.posts);
                });
            });


        },

        /**
         * Find a blog post by id
         *
         * @param blog
         * @param id
         * @params debug
         *         If this is set to true the response post will be logged to the console
         * @returns {*}
         */
        find: function(blog, id) {
            var wp = this;
            return $q(function(resolve, reject) {
                $http.get(wp.apiRoot + '/sites/' + blog + '/posts/' + id, {cache: wp.cacheEnabled}).success(function(res){
                    var post = wp._preparePost(res);
                    if(debug) {
                        console.log(post);
                    }
                    resolve(post);
                });
            });
        },
        /**
         * Finds a post by its wordpress slug
         *
         * @param blog
         * @param slug
         * @params debug
         *         If this is set to true the response post will be logged to the console
         * @returns {*}
         */
        findBySlug: function(blog, slug, debug) {
            var wp = this;
            return $q(function(resolve, reject) {
                $http.get(wp.apiRoot + '/sites/' + blog + '/posts/slug:' + slug, {cache: wp.cacheEnabled}).success(function(res){
                    var post = wp._preparePost(res);
                    if(debug) {
                        console.log(post);
                    }
                    resolve(post);
                });
            });
        },

        /**
         * Utility function that prepares the wordpress post response
         *
         * @param post
         */
        _preparePost: function(post) {
            // create a text version of the post content
            if(this.postOptions.createTextField) {
                post.text = this._stripTags(post.content);
            }

            // trust wordpress html
            if(this.postOptions.trustContent) {
                $sce.trustAsHtml(post.title);
                $sce.trustAsHtml(post.excerpt);
                $sce.trustAsHtml(post.content);
            }

            //todo create a way to register preparation tasks

            // return the prepared version of the post
            return post;
        },

        /**
         * Utility function to strip html tags
         *
         * @param input
         */
        _stripTags: function(input) {
            return input.replace(/(<([^>]+)>)/ig,"");
        }
    }
}]);