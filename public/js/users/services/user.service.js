packager('academy.factory', function() {

	var user_list = window.users || [];

	this.userService = academy.app.factory('UserService', ['$http', '$q', function ($http, $q) {

		var exports = {
			users: user_list,
			user: null
		};

		exports.getUsers = function() {
			var success = function(resp) {
				return exports.putUsers(JSON.parse(resp.response));
			};

			return $http.get(academy.routes.get_users).success(success);
		};

		exports.putUsers = function(list) {
			exports.users.length = 0;
			_.each(list, function(item) {
				exports.users.push(item);
			});
			return user_list = window.users = exports.users;
		};

		exports.validateAddUser = function(user) {
			var obj = academy.object_validators.new_user;

			var engine = academy.validator.create(user, obj);
			return engine.execute();
		};

		exports.validateEditUser = function(user) {
			var obj = academy.object_validators.user;

			var engine = academy.validator.create(user, obj);
			return engine.execute();
		};

		exports.editUser = function(user) {
			var success = function(resp) {
				// since resp is literal OK
				// put the user in the list
				if (resp == 'OK') {
					_.each(exports.users, function(item, index) {
						if (item.id == user.id) {
							exports[index] = user;
						}
					});
				}
				// update the list everywhere
				window.users = user_list = exports.users;

				return user;
			};

			return $http.post(academy.routes.edit_user, user).success(success);
		};

		// this is the edited user or viewed user
		exports.setUser = function(user) {
			exports.user = user;
		};

		exports.addUser = function(user) {

			// server returned the added user
			var success = function(resp) {

				var new_user = JSON.parse(resp.response);
				// add the new user in to user list
				exports.users.push(new_user);
				user_list = window.users = exports.users;
				return exports.user = new_user;
			};

			return $http.post(academy.routes.add_user, user).success(success);
		};

		exports.resetPassword = function(user) {

			var data = {
				"user_id": user.id
			};

			return $http.post(academy.routes.reset_user_password, data);
		};

		exports.deleteUser = function(user) {

			var success = function(resp) {
				if (resp == "OK") {
					exports.user = null;
					// delete user from user list and update every list
					var index = exports.users.indexOf(user);
					if (index > -1) {
						return window.users = user_list = exports.users.splice(index, 1);
					}
				}
			};

			var data = {"username": user.username};

			return $http.post(academy.routes.del_user, data).success(success);
		};

		return exports;
	}]);

});