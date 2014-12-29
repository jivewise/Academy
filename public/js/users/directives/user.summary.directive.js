packager('academy.directives', function() {
	academy.app.directive("userSummaryDirective", [function() {
		return {
			scope: {},
			controller: "MiddleController",
			controllerAs: "middle",
			templateUrl: "user-summary-tpl",
			link: function(scope, element, attrs) {

				var middle = scope.middle;

				scope.cancel = function() {
					middle.userService.setUser(null);
					middle.userDataService.setUser(null);
					middle.viewService.showUserList();
				};

				scope.showEditUser = function() {
					middle.viewService.showEditUser();
				};

				scope.showResetPassword = function() {

					var user = middle.userService.user;

					var error = function() {
						alert("Server error. Please try again later.");
					};

					var success = function() {
						middle.viewService.showUserList();
						middle.userDataService.setUser(null);
					};

					if (confirm("Are you sure to reset this "+ user.fullname +"' password?")) {
						var promise = middle.userService.resetPassword(user);
						promise.error(error).success(success);
					}
				};

				scope.showDeleteUser = function() {

					var user = middle.userService.user;

					// prevent the owner from deleting himself
					var user_id = middle.userService.user.id;
					var owner_id = middle.userService.user.passport.owner_id;

					if (user_id == owner_id) {
						alert("You can't delete yourself from your school.");
						return;
					}

					var error = function() {
						alert("Server error. Please try again later.");
					};

					var success = function() {
						middle.viewService.showUserList();
						middle.userDataService.setUser(null);
					};

					if (confirm('Are you sure to delete ' + user.fullname + " from your school?")) {
						var promise = middle.userService.deleteUser(user);
						promise.error(error).success(success);
					}
				};
			}
		};
	}]);
});
