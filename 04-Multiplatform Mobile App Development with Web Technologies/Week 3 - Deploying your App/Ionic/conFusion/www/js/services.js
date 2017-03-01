'use strict';

angular.module('conFusion.services', ['ngResource'])
        .constant("baseURL", "http://192.168.1.33:3000/") // If you change your server, come here and update this baseURL
        // http://localhost:3000/ 192.168.1.33

        .factory('menuFactory', ["$resource", "baseURL", function($resource, baseURL) {
            return $resource(baseURL + "dishes/:id", null, {
                'update': {
                    method: 'PUT'
                }
            });
        }])

        .factory('promotionFactory', ['$resource', 'baseURL', function ($resource, baseURL) {
            return $resource(baseURL + "promotions/:id");
        }])

        .factory('corporateFactory', ["$resource", "baseURL", function($resource, baseURL) {
            // This way I can call corporateFactory directly (i.e.: corporateFactory.get({id:3}))
            return $resource(baseURL+"leadership/:id");
        }])

        .service('feedbackFactory', ["$resource", "baseURL", function($resource, baseURL) {
            // No need to supply the parameter "save" to perform a POST call (it's already implemented)
            return $resource(baseURL + "feedback/");
        }])

        .factory('favoriteFactory', ['$resource', 'baseURL', '$localStorage', function ($resource, baseURL, $localStorage) {
            var favFac = {};
            // Assignment 3 - Task 3 - Initialize favorites information from local storage
            var favorites = $localStorage.getObject('favorites','[]');

            favFac.addToFavorites = function (index) {
                for (var i = 0; i < favorites.length; i++) {
                    if (favorites[i].id == index)
                        return;
                }
                favorites.push({id: index});
                $localStorage.storeObject('favorites',favorites); // Persist this update in the local storage
            }

            favFac.deleteFromFavorites = function (index) {
                for (var i = 0; i < favorites.length; i++) {
                    if (favorites[i].id == index) {
                        favorites.splice(i, 1);
                        $localStorage.storeObject('favorites',favorites); // Persist this update in the local storage
                    }
                }
            }

            favFac.getFavorites = function () {
                return favorites;
            };

            return favFac;
        }])

        // Enabling the use of $localStorage
        .factory('$localStorage', ['$window', function($window) {
            return {
                store: function(key, value) {
                    $window.localStorage[key] = value;
                },
                get: function(key, defaultValue) {
                    return $window.localStorage[key] || defaultValue;
                },
                storeObject: function(key, value) {
                    $window.localStorage[key] = JSON.stringify(value);
                },
                getObject: function(key,defaultValue) {
                    return JSON.parse($window.localStorage[key] || defaultValue);
                }
            }
        }])
;
