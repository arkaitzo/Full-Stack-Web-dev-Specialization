'use strict';

angular.module('confusionApp')

        .controller('MenuController', ['$scope', 'menuFactory', function($scope, menuFactory) {
            
            $scope.tab = 1;
            $scope.filtText = '';
            $scope.showDetails = false;
            
            $scope.showMenu = false;
            $scope.message = "Loading ...";

            // Returning all the dishes available + Success and Error functions
            menuFactory.getDishes().query(
                // Success function
                function(response) {
                    $scope.dishes = response; // 'response' is the actual data in case of success
                    $scope.showMenu = true;
                },
                // Error function
                function(response) {
                    $scope.message = "Error: " + response.status + " " + response.statusText;
                }
            );
            
            $scope.select = function(setTab) {
                $scope.tab = setTab;
                
                if (setTab === 2) {
                    $scope.filtText = "appetizer";
                }
                else if (setTab === 3) {
                    $scope.filtText = "mains";
                }
                else if (setTab === 4) {
                    $scope.filtText = "dessert";
                }
                else {
                    $scope.filtText = "";
                }
            };

            $scope.isSelected = function (checkTab) {
                return ($scope.tab === checkTab);
            };
    
            $scope.toggleDetails = function() {
                $scope.showDetails = !$scope.showDetails;
            };
        }])

        .controller('ContactController', ['$scope', function($scope) {

            $scope.feedback = {mychannel:"", firstName:"", lastName:"", agree:false, email:"" };
            
            var channels = [{value:"tel", label:"Tel."}, {value:"Email",label:"Email"}];
            
            $scope.channels = channels;
            $scope.invalidChannelSelection = false;
                        
        }])

        .controller('FeedbackController', ['$scope', function($scope) {
            
            $scope.sendFeedback = function() {
                
                console.log($scope.feedback);
                
                if ($scope.feedback.agree && ($scope.feedback.mychannel === "")) {
                    $scope.invalidChannelSelection = true;
                    console.log('incorrect');
                }
                else {
                    $scope.invalidChannelSelection = false;
                    $scope.feedback = {mychannel:"", firstName:"", lastName:"", agree:false, email:"" };
                    $scope.feedback.mychannel="";
                    $scope.feedbackForm.$setPristine();
                    console.log($scope.feedback);
                }
            };
        }])

        .controller('DishDetailController', ['$scope', '$stateParams', 'menuFactory', function($scope, $stateParams, menuFactory) {
            
            $scope.showDish = false;
            $scope.message="Loading ...";
            
            // Returning a specific dish
            $scope.dish = menuFactory.getDishes().get({id:parseInt($stateParams.id,10)})
            .$promise.then(
                function(response){
                    $scope.dish = response; // 'response' is the actual data in case of success
                    $scope.showDish = true;
                },
                function(response) {
                    $scope.message = "Error: " + response.status + " " + response.statusText;
                }
            );
        }])

        .controller('DishCommentController', ['$scope', 'menuFactory', function($scope, menuFactory) {
            
            $scope.mycomment = {rating:"5", comment:"", author:"", date:""};
            
            $scope.submitComment = function () {
                
                $scope.mycomment.date = new Date().toISOString();
                console.log($scope.mycomment);
                
                $scope.mycomment.rating = Number($scope.mycomment.rating);
                $scope.dish.comments.push($scope.mycomment);
                
                // Store the updated dish object (with the new comment) in the server
                menuFactory.getDishes().update({id:$scope.dish.id}, $scope.dish);
                
                $scope.commentForm.$setPristine();
                $scope.mycomment = {rating:"5", comment:"", author:"", date:""};
            };
        }])

        // implement the "IndexController"...
        .controller("IndexController", ["$scope", "menuFactory", "corporateFactory", function($scope, menuFactory, corporateFactory) {
            
            // Returning a specific dish
            $scope.showDish = false;
            $scope.message = "Loading ...";
            $scope.featuredDish = menuFactory.getDishes().get({id:0})
            .$promise.then(
                // Success function + Success and Error functions
                function(response) {
                    $scope.featuredDish = response; // 'response' is the actual data in case of success
                    $scope.showDish = true;
                },
                // Error function
                function(response) {
                    $scope.message = "Error: " + response.status + " " + response.statusText;
                }
            );
            
            // Returning a specific promotional dish + Success and Error functions
            $scope.showPromotion = false;
            $scope.messagePromotion = "Loading ...";
            $scope.promotionDish = menuFactory.getPromotion().get({id:0})
            .$promise.then(
                // Success function
                function(response) {
                    $scope.promotionDish = response; // 'response' is the actual data in case of success
                    $scope.showPromotion = true;
                },
                // Error function
                function(response) {
                    $scope.messagePromotion = "Error: " + response.status + " " + response.statusText;
                }
            );
            
            // Returning the Executive Chef info + Success and Error functions
            $scope.showLeader = false;
            $scope.messageLeader = "Loading ...";
            $scope.executiveChef = corporateFactory.getLeaders().get({id:3})
            .$promise.then(
                // Success function
                function(response) {
                    $scope.executiveChef = response; // 'response' is the actual data in case of success
                    $scope.showLeader = true;
                },
                // Error function
                function(response) {
                    $scope.messageLeader = "Error: " + response.status + " " + response.statusText;
                }
            );
        }])

        // ... and the "AboutController" here
        .controller("AboutController", ["$scope", "corporateFactory", function($scope, corporateFactory) {
            // Returning all the leaders available + Success and Error functions
            $scope.showLeaders = false;
            $scope.messageLeaders = "Loading ...";
            corporateFactory.getLeaders().query(
                // Success function
                function(response) {
                    $scope.leaders = response; // 'response' is the actual data in case of success
                    $scope.showLeaders = true;
                },
                // Error function
                function(response) {
                    $scope.messageLeaders = "Error: " + response.status + " " + response.statusText;
                }
            );
        }])
;
