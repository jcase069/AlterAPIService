angular.module('about').config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
    when('/about', {
      templateUrl: 'about/about.client.view.html'
    });
  }
]);
