angular.module('meals').controller('MealsController', ['$scope', '$routeParams', '$location', 'Authentication', 'Meals',
  function($scope, $routeParams, $location, Authentication, Meals) {
    $scope.authentication = Authentication;

    $scope.create = function() {
      var meal = new Meals({
        meal_time: this.meal_time,
        est_carbs: this.est_carbs
      });
      meal.$save(function(response) {
        $location.path('meals/' + response._id);
      }, function(errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    $scope.find = function() {
      $scope.meals = Meals.query();
    };

    $scope.findOne = function() {
      $scope.meal = Meals.get({
        mealId: $routeParams.mealId
      });
    };

    $scope.update = function() {
      $scope.meal._id=$scope.meal.meal_ID;
      $scope.meal.$update(function () {
        $location.path('meals/'+$scope.meal.meal_ID);
      }, function(errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    $scope.delete = function(meal) {
      if (meal) {
        meal._id=meal.meal_ID;
        meal.$remove(function() {
          for (var i in $scope.meals) {
            if ($scope.meals[i] === meal) {
              $scope.meals.splice(i,1);
            }
          }
          $location.path('meals');
        });
      } else {
        $scope.meal.$remove(function() {
          $location.path('meals');
        });
      }
    };

  }
]);
