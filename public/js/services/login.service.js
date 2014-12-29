
packager('academy.factory', function() {
	this.login = academy.app.factory('LoginService', ['$http', '$q', function ($http, $q) {
		var exports = {
			token : null 
		};

		exports.init = function(username, password) {
			var creds = {
				user: username,
				pass: password
			};

			var success = function(data) {
				if (data.response) {
					exports.token = JSON.parse(data.response);
					return exports.token;
				}
			};
			return $http.post(academy.routes.ajax_login, creds).success(success);
		}

		return exports;
	}]);
});
