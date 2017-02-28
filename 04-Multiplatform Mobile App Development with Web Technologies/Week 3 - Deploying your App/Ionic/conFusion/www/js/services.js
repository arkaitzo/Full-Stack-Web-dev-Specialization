'use strict';

angular.module('conFusion.services', ['ngResource'])
        .constant("baseURL", "http://localhost:3000/") // If you change your server, come here and update this baseURL
        
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
            this.getFeedback = function() {
                return $resource(baseURL + "feedback/");
                // No need to supply the parameter "save" to perform a POST call (it's already implemented)
            };
        }])

        .factory('favoriteFactory', ['$resource', 'baseURL', function ($resource, baseURL) {
            var favFac = {};
            var favorites = [];

            favFac.addToFavorites = function (index) {
                for (var i = 0; i < favorites.length; i++) {
                    if (favorites[i].id == index)
                        return;
                }
                favorites.push({id: index});
            }
            
            favFac.deleteFromFavorites = function (index) {
                for (var i = 0; i < favorites.length; i++) {
                    if (favorites[i].id == index) {
                        favorites.splice(i, 1);
                    }
                }
            }

            favFac.getFavorites = function () {
                return favorites;
            };

            return favFac;
        }])
;
