angular.module('authentication').config(['$routeProvider',
	function($routeProvider) {
		$routeProvider.
		when('/', {
			templateUrl: 'authentication/views/authentication.client.view.html'
		}).
		otherwise({
			redirectTo: '/'
		});
	}
]);
