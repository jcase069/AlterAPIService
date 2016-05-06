angular.module('meals').factory('Meals', ['$resource', function($resource) {
  return $resource('api/meals/:mealId', {
    mealId: '@_id'
  }, {
    update: {
      method: 'PUT'
    }
  });
}]);
