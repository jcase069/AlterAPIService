angular.module('meals').config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
    when('/meals', {
      templateUrl: 'meals/views/list-meal.client.view.html'
    }).
    when('/meals/create', {
      templateUrl: 'meals/views/create-meal.client.view.html'
    }).
    when('/meals/:mealId', {
      templateUrl: 'meals/views/view-meal.client.view.html'
    }).
    when('/meals/:mealId/edit', {
      templateUrl: 'meals/views/edit-meal.client.view.html'
    });
  }
]);
