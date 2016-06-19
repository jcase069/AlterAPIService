angular.module('bloodsugars').factory('BloodSugars', ['$resource', function($resource) {
  return $resource('api/blood-sugars/:bloodSugarId', {
    bloodSugarId: '@_id'
  }, {
    update: {
      method: 'PUT'
    }
  });
}]);
