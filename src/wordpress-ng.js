angular.module('wordpress-ng', []).factory('WordPressNg', ['$http', '$q', function($http, $q) {
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
            createTextField: true // creates a text version of the content
        },

        /**
         * Cache the wordpress api responses
         */
        cacheEnabled: true,

        /**
         * slug -> page index
         */
        pageIndex: [],

        /**
         * Loads all of the pages and indexes them
         *
         * This approach improves performance for smaller single page sites compared to using many individual requests
         *
         * @param blog
         */
        indexPages: function(blog) {
            var wp = this;
            var key = wp.indexKey(blog);
            wp.pageIndex[key] = [];

            return $q(function(resolve, reject) {
                wp.posts(blog, {type: 'page', number:100}).then(function(posts){
                    angular.forEach(posts, function(post){
                        wp.pageIndex[key][post.slug] = post;
                    });
                    resolve(wp.pageIndex[key]);
                });
            });
        },

        /**
         * Find a page from the page index
         *
         * @param blog
         * @param slug
         */
        findIndexedPage: function(blog, slug) {
            var key = this.indexKey(blog);
            return this.pageIndex[key][slug];
        },

        /**
         * Creates the index key
         *
         * @param blog
         * @returns {*}
         */
        indexKey: function(string) {
            return string.replace(/\./g,'_');
        },

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
}])
/**
 * Filters posts by tag
 *
 * @param posts collection of posts
 * @param tag
 * @param limit (optional) defaults to 20
 *
 * @example <div ng-repeat="post in posts | hasTag:'featured':4><!-- do something with the post --></div>"
 *
 */
.filter('wp_tag', function () {
    return function (posts, tag, limit) {
        if(! posts) return false;
        if(! limit) limit = 20;
        var filtered = [];
        angular.forEach(posts, function(post){
            if(filtered.length < limit) {
                if (post.tags.hasOwnProperty(tag)) {
                    filtered.push(post);
                }
            }
        });
        return filtered;
    };
});