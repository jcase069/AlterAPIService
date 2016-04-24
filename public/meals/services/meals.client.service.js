angular.module('articles').factory('Articles', ['$resource', function($resource) {
  return $resource('api/meals/:mealId', {
    mealId: '@-id'
  }, {
    update: {
      method: 'PUT'
    }
  });
}]);
