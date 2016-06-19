angular.module('bloodsugars').controller('BloodSugarsController', ['$scope', '$routeParams', '$location', 'Authentication', 'BloodSugars',
  function($scope, $routeParams, $location, Authentication, BloodSugars) {
    $scope.authentication = Authentication;

    $scope.create = function() {
      var blood_sugar = new BloodSugars({
        measurement: this.measurement,
        measurement_time: this.measurement_time,
      });
      blood_sugar.$save(function(response) {
        $location.path('bloodsugars/' + response._id);
      }, function(errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    $scope.find = function() {
      $scope.blood_sugars = BloodSugars.query();
    };

    $scope.findOne = function() {
      $scope.blood_sugar = BloodSugars.get({
        bloodSugarId: $routeParams.bloodSugarId
      });
    };

    $scope.update = function() {
      $scope.blood_sugar._id=$scope.blood_sugar.blood_sugar_id;
      $scope.blood_sugar.$update(function () {
        $location.path('bloodsugars/'+$scope.blood_sugar.blood_sugar_id);
      }, function(errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    $scope.delete = function(bloodSugar) {
      if (bloodSugar) {
        bloodSugar._id=bloodSugar.blood_sugar_id;
        bloodSugar.$remove(function() {
          for (var i in $scope.blood_sugars) {
            if ($scope.blood_sugars[i] === bloodSugar) {
              $scope.blood_sugars.splice(i,1);
            }
          }
          $location.path('bloodsugars');
        });
      } else {
        $scope.blood_sugar.$remove(function() {
          $location.path('bloodsugars');
        });
      }
    };

  }
]);
