'use strict';

angular.module('confusionApp')
        .constant("baseURL", "http://localhost:3000/") // If you change your server, come here and update this baseURL
        
        .service('menuFactory', ["$resource", "baseURL", function($resource, baseURL) {
            this.getDishes = function() {
                // Fetch the data from the server - $resource(url, [paramDefaults], [actions], options);
                return $resource(baseURL + "dishes/:id",
                                null,
                                {"update":{method:"PUT"}}); // We supply the parameter "update" to perform a PUT call (that in REST it means to update an existing object)
            };

            // implement a function named getPromotion
            // that returns a selected promotion.   
            this.getPromotion = function() {
                return $resource(baseURL + "promotions/:id");
                // This time we do not need to supply the parameter "update"
            };
        }])

        .factory('corporateFactory', ["$resource", "baseURL", function($resource, baseURL) {
            /*** REMEMBER THIS IS A FACTORY NOT A SERVICE ***/
            var corpfac = {}; // Empty object (needed when defining a 'factory')
            corpfac.getLeaders = function() {
                return $resource(baseURL + "leadership/:id");
                // This time we do not need to supply the parameter "update"
            };
    
            // Returning the object (that contains both functions)
            return corpfac;
        }])

        .service('feedbackFactory', ["$resource", "baseURL", function($resource, baseURL) {
            this.getFeedback = function() {
                return $resource(baseURL + "feedback/",
                                null,
                                {"save":{method:"POST"}}); // We supply the parameter "save" to perform a POST call (that in REST it means to create a new object)
            };
        }])
;
