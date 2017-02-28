angular.module('conFusion.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout, $localStorage) {

    // With the new view caching in Ionic, Controllers are only called
    // when they are recreated or on app start, instead of every page change.
    // To listen for when this page is active (for example, to refresh data),
    // listen for the $ionicView.enter event:
    //$scope.$on('$ionicView.enter', function(e) {
    //});

    // Load loginData information from the local storage if it exists. Initialize it to an empty object otherwise.
    $scope.loginData = $localStorage.getObject('userinfo','{}');

    // Create the login modal that we will use later
    $ionicModal.fromTemplateUrl('templates/login.html', {
        scope: $scope
    }).then(function(modal) {
        $scope.modal = modal;
    });

    // Triggered in the login modal to close it
    $scope.closeLogin = function() {
        $scope.modal.hide();
    };

    // Open the login modal
    $scope.login = function() {
        $scope.modal.show();
    };

    // Perform the login action when the user submits the login form
    $scope.doLogin = function() {
        console.log('Doing login', $scope.loginData);
        $localStorage.storeObject('userinfo',$scope.loginData);
        // In a real application we should encrypt the loginData before storing it in the local storage
        
        // Simulate a login delay. Remove this and replace with your login
        // code if using a login system
        $timeout(function() {
            $scope.closeLogin();
        }, 1000);
    };
    
    
    // Form data for the reserve modal
    $scope.reservation = {};
    
    // Create the reserve modal that we will use later
    $ionicModal.fromTemplateUrl('templates/reserve.html', {
        scope: $scope
    }).then(function(modal) {
        $scope.reserveform = modal;
    });

    // Triggered in the reserve modal to close it
    $scope.closeReserve = function() {
        $scope.reserveform.hide();
    };

    // Open the reserve modal
    $scope.reserve = function() {
        $scope.reserveform.show();
    };

    // Perform the reserve action when the user submits the reserve form
    $scope.doReserve = function() {
        console.log('Doing reservation', $scope.reservation);

        // Simulate a reservation delay. Remove this and replace with your reservation
        // code if using a server system
        $timeout(function() {
            $scope.closeReserve();
        }, 1000);
        
        // Reset reservation
        $scope.reservation = {};
    };
})

.controller('MenuController', ['$scope', 'menuFactory', 'favoriteFactory', 'baseURL', '$ionicListDelegate', function($scope, menuFactory, favoriteFactory, baseURL, $ionicListDelegate) {
    $scope.baseURL = baseURL;
    
    $scope.tab = 1;
    $scope.filtText = '';
    $scope.showDetails = false;

    $scope.showMenu = false;

    // Returning all the dishes available + Success and Error functions
    menuFactory.query(
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
    
    $scope.addFavorite = function (index) {
        console.log("index is " + index);
        favoriteFactory.addToFavorites(index);
        $ionicListDelegate.closeOptionButtons(); // Remove option buttons
    };
}])

.controller('ContactController', ['$scope', function($scope) {
    $scope.feedback = {mychannel:"", firstName:"", lastName:"", agree:false, email:"" };

    var channels = [{value:"telephone", label:"Telephone"}, {value:"email",label:"Email"}];

    $scope.channels = channels;
    $scope.invalidChannelSelection = false;

}])

.controller('FeedbackController', ['$scope', 'feedbackFactory', function($scope, feedbackFactory) {
    $scope.sendFeedback = function() {

        console.log($scope.feedback);

        if ($scope.feedback.agree && ($scope.feedback.mychannel === "")) {
            $scope.invalidChannelSelection = true;
            console.log('incorrect');
        }
        else {
            $scope.invalidChannelSelection = false;

            // Store the feedback object in the server
            feedbackFactory.save($scope.feedback);

            $scope.feedback = {mychannel:"", firstName:"", lastName:"", agree:false, email:"" };
            $scope.feedbackForm.$setPristine();
            console.log($scope.feedback);
        }
    };
}])

.controller('DishDetailController', ['$scope', '$stateParams', 'dish', 'menuFactory', 'favoriteFactory', 'baseURL', '$ionicPopover', '$ionicModal', '$timeout',function($scope, $stateParams, dish, menuFactory, favoriteFactory, baseURL, $ionicPopover, $ionicModal, $timeout) {
    $scope.baseURL = baseURL;
    
    $scope.showDish = false;

    // Returning a specific dish
    $scope.dish = dish;
    
    // Assignment 2 - Task 1: Popover
    $ionicPopover.fromTemplateUrl('templates/dish-detail-popover.html', {
        scope: $scope
    }).then(function(popover) {
        $scope.popover = popover;
    });
    $scope.openPopover = function($event) {
        $scope.popover.show($event);
    };
    $scope.closePopover = function() {
        $scope.popover.hide();
    };
    //Cleanup the popover when we're done with it!
    $scope.$on('$destroy', function() {
        $scope.popover.remove();
    });
    // Execute action on hidden popover
    $scope.$on('popover.hidden', function() {
        // Execute action
        console.log("Popover Hidden");
    });
    // Execute action on remove popover
    $scope.$on('popover.removed', function() {
        // Execute action
        console.log("Popover Removed");
    });
    
    // Assignment 2 - Task 2: Adding the dish to the list of our favorite dishes
    $scope.addFavorite = function() {
        index = parseInt($stateParams.id,10);
        console.log("index is " + index);
        favoriteFactory.addToFavorites(index);
        $scope.closePopover();
    };
    
    // Assignment 2 - Task 3
    // Form data for the comment modal
    $scope.mycomment = {rating:"", comment:"", author:"", date:""};
    // Create the comment modal that we will use later
    $ionicModal.fromTemplateUrl('templates/dish-comment.html', {
        scope: $scope
    }).then(function(modal) {
        $scope.commentForm = modal;
    });
    // Triggered in the submitComment modal to close it
    $scope.closeComment = function() {
        $scope.commentForm.hide();
    };
    // Open the reserve modal
    $scope.addComment = function() {
        $scope.closePopover();
        // Set a timeout to show the modal only in the next cycle (to avoid freezing the app)
        $timeout(function() {
            $scope.commentForm.show();
        }, 0);
    };
    // Perform the reserve action when the user submits the reserve form
    $scope.submitComment = function() {
        $scope.mycomment.date = new Date().toISOString();
        $scope.mycomment.rating = Number($scope.mycomment.rating);
        console.log('Writing comment', $scope.mycomment);
        
        // Add the comment to the comments of this particular dish
        $scope.dish.comments.push($scope.mycomment);

        // Store the updated dish object (with the new comment) in the server
        menuFactory.update({id:$scope.dish.id}, $scope.dish);

        // Reset the form
        $scope.mycomment = {rating:"", comment:"", author:"", date:""};
        
        // Close the modal
        $scope.closeComment();
    };
}])

.controller('DishCommentController', ['$scope', 'menuFactory', function($scope, menuFactory) {
    $scope.mycomment = {rating:"5", comment:"", author:"", date:""};

    $scope.submitComment = function () {

        $scope.mycomment.date = new Date().toISOString();
        console.log($scope.mycomment);

        $scope.mycomment.rating = Number($scope.mycomment.rating);
        $scope.dish.comments.push($scope.mycomment);

        // Store the updated dish object (with the new comment) in the server
        menuFactory.update({id:$scope.dish.id}, $scope.dish);

        $scope.commentForm.$setPristine();
        $scope.mycomment = {rating:"5", comment:"", author:"", date:""};
    };
}])

// implement the "IndexController"...
.controller('IndexController', ['$scope', 'menuFactory', 'promotionFactory', 'corporateFactory', 'baseURL', function($scope, menuFactory, promotionFactory, corporateFactory, baseURL) {
    $scope.baseURL = baseURL;
    
    $scope.leader = corporateFactory.get({id:3});
    
    $scope.showDish = false;
    
    $scope.dish = menuFactory.get({id:0})
    .$promise.then(
        function(response){
            $scope.dish = response;
            $scope.showDish = true;
        },
        function(response) {
            $scope.message = "Error: "+response.status + " " + response.statusText;
        }
    );
    $scope.promotion = promotionFactory.get({id:0});
}])

// ... and the "AboutController" here
.controller('AboutController', ['$scope', 'corporateFactory', 'baseURL', function($scope, corporateFactory, baseURL) {
    $scope.baseURL = baseURL;
    
    $scope.leaders = corporateFactory.query();
    console.log($scope.leaders);
}])

// Implementing the "FavoritesController"...
.controller('FavoritesController', ['$scope', 'dishes', 'favorites', 'favoriteFactory', 'baseURL', '$ionicListDelegate', '$ionicPopup', '$timeout', function ($scope, dishes, favorites, favoriteFactory, baseURL, $ionicListDelegate, $ionicPopup, $timeout) {
    $scope.baseURL = baseURL;
    $scope.shouldShowDelete = false;
    
    $scope.favorites = favorites;
    $scope.dishes = dishes;
    console.log($scope.dishes, $scope.favorites);
    

    $scope.toggleDelete = function () {
        $scope.shouldShowDelete = !$scope.shouldShowDelete;
        console.log($scope.shouldShowDelete);
    }

    $scope.deleteFavorite = function (index) {
        var confirmPopup = $ionicPopup.confirm({
            title: 'Confirm Delete',
            template: 'Are you sure you want to delete this item?'
        });

        confirmPopup.then(function (res) {
            if (res) {
                console.log('Ok to delete');
                favoriteFactory.deleteFromFavorites(index);
            } else {
                console.log('Canceled delete');
            }
        });

        $scope.shouldShowDelete = false;
    }
}])

// Filter the favorite dishes - If you have various filters, it may be better to create a 'filters.js' file
.filter('favoriteFilter', function () {
    return function (dishes, favorites) {
        var out = [];
        // Linear search - With a large number of dishes and favorites, you should implement a much better way of doing this search (using computer algorithms)
        for (var i = 0; i < favorites.length; i++) {
            for (var j = 0; j < dishes.length; j++) {
                if (dishes[j].id === favorites[i].id)
                    out.push(dishes[j]);
            }
        }
        return out;
}});
;