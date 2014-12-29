packager('academy', function() {
	var schoolApp = angular.module('schoolApp', []);
	schoolApp.config(function ($httpProvider) {
		$httpProvider.interceptors.push('httpRequestInterceptor');
	});

	schoolApp.factory('httpRequestInterceptor', ['$window', function($window) {
		return {
			request: function($config) {
				$config.data = $config.data ? $config.data : {};
				$config.data.authorization = $window.authtoken;
				return $config;
			}
		};
	}]);
	this.app = schoolApp;
});
