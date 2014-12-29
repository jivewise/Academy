packager('academy.factory', function() {

	var passport_list = window.passports || [];

	this.passportService = academy.app.factory('PassportService', ["$http", "$q", function ($http, $q) {

		var exports = {
			passports: passport_list,
			hasAvailablePassport: true
		};

		exports.getPassports = function() {
			var success = function(resp) {
				return exports.putPassports(JSON.parse(resp.response));
			};

			return $http.get(academy.routes.get_passports).success(success);
		};

		exports.putPassports = function(list) {
			exports.passports.length = 0;
			_.each(list, function(item) {
				exports.passports.push(item);
			});
			return passport_list = window.passports = exports.passports;
		};

		// get passports once from here
		if (!exports.passports.length) {
			exports.getPassports();
		}

		// todo: when adding or deleting a user, check users length and passports length
		// then change "hasAvailablePassport" value

		return exports;
	}]);
});
