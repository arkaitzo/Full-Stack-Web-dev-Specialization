Assignment 3
===================


----------
### **services.js**
_Copy and paste the code showing the implementation of the **getLeaders()** and the **getLeader()** functions in **services.js**:_
```
// Attaching functions to the "corpfac" object
corpfac.getLeaders = function() {
	return leadership;
};
corpfac.getLeader = function(index) {
	return leadership[index];
};

// Returning the object (that contains both functions)
return corpfac;
```

_Copy and paste the code for the **getPromotion()** function_
```
this.getPromotion = function(index) {
	return promotions[index];
};
```

----------
### **controllers.js**
_Copy and paste the code for the **IndexController** function:_
```
.controller("IndexController", ["$scope", "menuFactory", "corporateFactory", function($scope, menuFactory, corporateFactory) {
	$scope.featuredDish = menuFactory.getDish(0);
	$scope.promotionDish = menuFactory.getPromotion(0);
	$scope.executiveChef = corporateFactory.getLeader(3);
}])
```

_Copy and paste the code for the **AboutController** function:_
```
.controller("AboutController", ["$scope", "corporateFactory", function($scope, corporateFactory) {
	$scope.leaders = corporateFactory.getLeaders();
}])
```

----------
### **aboutus.html**
_Copy and paste the code from **aboutus.html** that constructs the information for the corporate leaders:_
```
<!-- Corporate Leaders List -->
<li class="media" ng-repeat="leader in leaders">
    <div class="media-left media-middle">
        <img class="media-object img-thumbnail"
         ng-src={{leader.image}} title={{leader.name}}>
    </div>
    <div class="media-body">
        <h3 class="media-heading">{{leader.name}}
            <small>{{leader.designation}}</small></h3>
        <p>{{leader.description}}</p>
    </div>
</li>
<!-- End of Leaders List -->
```

----------
### **home.html**
_Copy and paste the code (the media objects) from **home.html** that constructs the information for the featured dish, featured promotion and executive chef:_
```
<!-- Featured Dish -->
<div class="media">
    <div class="media-left media-middle">
        <img class="media-object img-thumbnail"
         ng-src={{featuredDish.image}} title={{featuredDish.name}}>
    </div>
    <div class="media-body">
        <h2 class="media-heading">{{featuredDish.name}}
         <span class="label label-danger">{{featuredDish.label}}</span>
            <span class="badge">{{featuredDish.price | currency}}</span></h2>
        <p>{{featuredDish.description}}</p>
    </div>
</div>
<!-- End of Featured Dish -->

<!-- Month's Promotion -->
<div class="media">
    <div class="media-body">
        <h2 class="media-heading">{{promotionDish.name}}
         <span class="label label-danger">{{promotionDish.label}}</span>
            <span class="badge">{{promotionDish.price | currency}}</span></h2>
        <p>{{promotionDish.description}}</p>
    </div>
    <div class="media-right media-middle">
        <img class="media-object img-thumbnail"
         ng-src={{promotionDish.image}} title={{promotionDish.name}}>
    </div>
</div>
<!-- End of Month's Promotion -->

<!-- Executive Chef Info -->
<div class="media">
    <div class="media-left media-middle">
        <img class="media-object img-thumbnail"
         ng-src={{executiveChef.image}} title={{executiveChef.name}}>
    </div>
    <div class="media-body">
        <h3 class="media-heading">{{executiveChef.name}}
        <small>{{executiveChef.designation}}</small></h3>
        <p>{{executiveChef.description}}</p>
    </div>
</div>
<!-- End of Executive Chef Info -->
```

----------
> **Author:** Arkaitz Etxezarreta [Linkedin](https://www.linkedin.com/in/aetxezarreta "Arkaitz's Linkedin Profile") | [Github](https://github.com/arkaitzo "Arkaitz's Github Profile")