angular.module('conFusion.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout, $localStorage, $ionicPlatform, $cordovaCamera,
                                 $cordovaImagePicker, $cordovaFile) {

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
    
    
    // Form data for the registration modal
    $scope.registration = {};
    
    // Create the registration modal that we will use later
    $ionicModal.fromTemplateUrl('templates/register.html', {
        scope: $scope
    }).then(function (modal) {
        $scope.registerform = modal;
    });

    // Triggered in the registration modal to close it
    $scope.closeRegister = function () {
        $scope.registerform.hide();
    };

    // Open the registration modal
    $scope.register = function () {
        $scope.registerform.show();
    };

    // Perform the registration action when the user submits the registration form
    $scope.doRegister = function () {
        // Simulate a registration delay. Remove this and replace with your registration
        // code if using a registration system
        $timeout(function () {
            $scope.closeRegister();
        }, 1000);
    };
    
    $ionicPlatform.ready(function() {
        var options = {
            quality: 50,
            destinationType: Camera.DestinationType.DATA_URL,
            sourceType: Camera.PictureSourceType.CAMERA,
            allowEdit: true,
            encodingType: Camera.EncodingType.JPEG,
            targetWidth: 100,
            targetHeight: 100,
            popoverOptions: CameraPopoverOptions,
            saveToPhotoAlbum: false
        };
        $scope.takePicture = function() {
            $cordovaCamera.getPicture(options).then(function(imageData) {
                $scope.registration.imgSrc = "data:image/jpeg;base64," + imageData;
            }, function(err) {
                console.log(err);
            });
            
            $scope.registerform.show();
        };
        
        
        // Assignment 4 - Task 1 - Enabling the Image Picker plugin
        var pictureOptions = {
            maximumImagesCount: 1,
            quality: 50,
            width: 100,
            height: 100
        };
        $scope.getPicture = function () {
            $cordovaImagePicker.getPictures(pictureOptions).then(function(result) {
                var imgURI = result[0]; // Enough for the emulator, but not for a real device

                //Extract the directory path from URI
                var imgDir = imgURI.substring(0,imgURI.lastIndexOf('/'));

                // Extract the file name from URI
                var imgName = imgURI.substring((imgURI.lastIndexOf('/')+1), imgURI.length); 

                //Read the file as Data URL
                $cordovaFile.readAsDataURL(imgDir,imgName).then(function(result) {
                    $scope.registration.imgSrc = result;
                },
                function(error){
                    console.log(error);
                });
            });
            
            $scope.registerform.show();
        }; // Enf of Assignment 4 - Task 1
    });
})

.controller('MenuController', ['$scope', 'dishes', 'favoriteFactory', 'baseURL', '$ionicListDelegate', '$ionicPlatform', '$cordovaLocalNotification', '$cordovaToast', function($scope, dishes, favoriteFactory, baseURL, $ionicListDelegate, $ionicPlatform, $cordovaLocalNotification, $cordovaToast) {
    $scope.baseURL = baseURL;

    $scope.tab = 1;
    $scope.filtText = '';
    $scope.showDetails = false;

    $scope.showMenu = false;

    // Injecting the data obtained through resolution
    $scope.dishes = dishes;

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
        
        // Notifying the User
        $ionicPlatform.ready(function () {
            // Notification bar
            $cordovaLocalNotification.schedule({
                id: 1,
                title: "Added Favorite",
                text: $scope.dishes[index].name
            })
            .then(function () {
                console.log('Added Favorite '+$scope.dishes[index].name);
            },
            function () {
                console.log('Failed to add Notification ');
            });

            // Toast notification    
            $cordovaToast
            .show('Added Favorite '+$scope.dishes[index].name, 'long', 'center')
            .then(function (success) {
                    // success
                },
                function (error) {
                    // error
                });
        });
        
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

.controller('DishDetailController', ['$scope', '$stateParams', 'dish', 'menuFactory', 'favoriteFactory', 'baseURL', '$ionicPopover', '$ionicModal', '$timeout', '$ionicPlatform', '$cordovaLocalNotification', '$cordovaToast', function($scope, $stateParams, dish, menuFactory, favoriteFactory, baseURL, $ionicPopover, $ionicModal, $timeout, $ionicPlatform, $cordovaLocalNotification, $cordovaToast) {
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

    $scope.addFavorite = function() {
        index = parseInt($stateParams.id,10);
        console.log("index is " + index);
        favoriteFactory.addToFavorites(index);
        $scope.closePopover();
        
        // Assignment 4 - Task 2 -  Notifying the User
        $ionicPlatform.ready(function () {
            // Notification bar
            $cordovaLocalNotification.schedule({
                id: 1,
                title: "Added Favorite",
                text: $scope.dish.name
            })
            .then(function () {
                console.log('Added Favorite '+$scope.dish.name);
            },
            function () {
                console.log('Failed to add Notification ');
            });

            // Toast notification    
            $cordovaToast
            .show('Added Favorite ' + $scope.dish.name, 'long', 'bottom')
            .then(function (success) {
                    // success
                },
                function (error) {
                    // error
                });
        }); // End of Assignment 4 - Task 2
        
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
.controller('IndexController', ['$scope', 'dish', 'promotion', 'leader', 'baseURL', function($scope, dish, promotion, leader, baseURL) {
    $scope.baseURL = baseURL;
    $scope.showDish = false;

    // Injecting the data obtained through resolution
    $scope.dish = dish;
    $scope.promotion = promotion;
    $scope.leader = leader;
}])

// ... and the "AboutController" here
.controller('AboutController', ['$scope', 'leaders', 'baseURL', function($scope, leaders, baseURL) {
    $scope.baseURL = baseURL;

    // Injecting the data obtained through resolution
    $scope.leaders = leaders;
    console.log($scope.leaders);
}])

// Implementing the "FavoritesController"...
.controller('FavoritesController', ['$scope', 'dishes', 'favorites', 'favoriteFactory', 'baseURL', '$ionicListDelegate', '$ionicPopup', '$timeout', '$ionicPlatform', '$cordovaVibration', function ($scope, dishes, favorites, favoriteFactory, baseURL, $ionicListDelegate, $ionicPopup, $timeout, $ionicPlatform, $cordovaVibration) {
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
                // Assignment 4 - Task 3 - Making the phone vibrate
                $ionicPlatform.ready(function () {
                    $cordovaVibration.vibrate(100);
                }); // End of Assignment 4 - Task 3
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
