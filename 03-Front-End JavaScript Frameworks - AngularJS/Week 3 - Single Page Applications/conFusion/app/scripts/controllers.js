"use strict";

angular.module("confusionApp")
    .controller("MenuController", ["$scope", "menuFactory", function($scope, menuFactory) {
        $scope.tab = 1;
        $scope.filtText = "";
        $scope.showDetails = false; // Variable to be used in toggleDetails() (implemented below)

        // Call the getDishes() method of the menuFactory to get the dishes object and put it onto my $scope
        $scope.dishes= menuFactory.getDishes(); // First inject the service into MenuController (Dependency Injection)

        // Implementing the select() function
        $scope.select = function(setTab) {
            $scope.tab = setTab;

            // filtText
            if (setTab === 2)
                {$scope.filtText = "appetizer";}
            else if (setTab === 3)
                {$scope.filtText = "mains";}
            else if (setTab === 4)
                {$scope.filtText = "dessert";}
            else
                {$scope.filtText = "";}
        };

        // Implementing the isSelected() function
        $scope.isSelected = function(checkTab) {
            return ($scope.tab === checkTab);
        };

        // Implementing the toggleDetails() function
        $scope.toggleDetails = function() {
            $scope.showDetails = !$scope.showDetails;
        };
    }])

    .controller("ContactController", ["$scope", function($scope) {
        // This object will be also accesible by FeedbackController (because ContactController is its parent)
        $scope.feedback = {mychannel:"", firstName:"",
                          lastName:"", agree:false, email:""};
        
        var channels = [{value:"tel", label:"Tel."}, {value:"email",label:"Email"}]; // Value: Email or email?
        $scope.channels = channels;
        $scope.invalidChannelSelection = false;
    }])

    .controller("FeedbackController", ["$scope", function($scope) {
        $scope.sendFeedback = function() {
            console.log($scope.feedback);
            if ($scope.feedback.agree && ($scope.feedback.mychannel == "") && !$scope.feedback.mychannel) {
                $scope.invalidChannelSelection = true;
                console.log('incorrect');
            }
            else {
                $scope.invalidChannelSelection = false;
                $scope.feedback = {mychannel:"", firstName:"", lastName:"",
                                   agree:false, email:"" };
                $scope.feedback.mychannel="";
                $scope.feedbackForm.$setPristine();
                console.log($scope.feedback);
            }
        };
    }])

    .controller('DishDetailController', ["$scope", "$stateParams", "menuFactory",
                                         function($scope, $stateParams, menuFactory) {
        // Call the getDish() method of the menuFactory to get the dish object needed and put it onto my $scope
        $scope.dish = menuFactory.getDish(parseInt($stateParams.id,10)); // Base 10 number system
    }])

    .controller('DishCommentController', ["$scope", function($scope) {
        //Step 1: Create a JavaScript object to hold the comment from the form. Rating by default = 5
        $scope.comment = {author:"", rating:5, comment:""};
        
        $scope.submitComment = function () {
            //Step 2: This is how you record the date
            //"The date property of your JavaScript object holding the comment" = new Date().toISOString();
            $scope.comment.date = new Date().toISOString();
            
            // Step 3: Push your comment into the dish's comment array
            $scope.comment.rating = Number($scope.comment.rating); // Converting the rating into a number
            $scope.dish.comments.push($scope.comment); // $scope...(JS Object holding the comment);
            
            //Step 4: reset your form to pristine
            $scope.commentForm.$setPristine();
            
            //Step 5: reset your JavaScript object that holds your comment
            $scope.comment = {author:"", rating:5, comment:""};
        }
    }])
;