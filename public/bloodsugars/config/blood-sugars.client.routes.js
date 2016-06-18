angular.module('bloodsugars').config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
    when('/bloodsugars', {
      templateUrl: 'bloodsugars/views/list-blood-sugars.client.view.html'
    }).
    when('/bloodsugars/create', {
      templateUrl: 'bloodsugars/views/create-blood-sugar.client.view.html'
    }).
    when('/bloodsugars/:bloodSugarId', {
      templateUrl: 'bloodsugars/views/view-blood-sugar.client.view.html'
    }).
    when('/bloodsugars/:bloodSugarId/edit', {
      templateUrl: 'bloodsugars/views/edit-blood-sugar.client.view.html'
    });
  }
]);
