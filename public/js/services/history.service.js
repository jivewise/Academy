packager('academy.factory', function() {

	var history_list = window.histories || [];

	this.historyService = academy.app.factory('HistoryService', ["$http", "$q", function ($http, $q) {

		// histories are all users' history
		// user_histories are retrieved by user ids
		var exports = {
			histories: history_list,
			user_histories: []
		};

		exports.putHistories = function(list) {
			exports.histories.length = 0;
			_.each(list, function(item) {
				exports.histories.push(item);
			});
			return history_list = window.histories = exports.histories;
		};

		exports.getHistories = function() {
			var success = function(resp) {
				return exports.putHistories(JSON.parse(resp.response));
			};

			var data = {"length": 10};

			return $http.post(academy.routes.get_histories, data).success(success);
		};

		if (!exports.histories.length) {
			exports.getHistories();
		}

		exports.putUserHistories = function(list) {
			exports.user_histories.length = 0;
			_.each(list, function(item) {
				exports.user_histories.push(item);
			});
			return exports.user_histories;
		};

		// get histories according to user_id(s)
		exports.getUserHistories = function(users) {
			var success = function(resp) {
				return exports.putUserHistories(JSON.parse(resp.response));
			};

			// there is just no history for new user
			var error = function(resp) {
				return exports.user_histories.length = 0;
			};

			var user_ids = [];

			_.each(users, function(user) {
				user_ids.push(user.id);
			});

			var data = {
				"user_ids": user_ids,
				"length": 10
			};

			return $http.post(academy.routes.get_histories, data).error(error).success(success);
		};

		return exports;
	}]);
});
