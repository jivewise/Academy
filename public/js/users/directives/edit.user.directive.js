packager('academy.directives', function() {
	academy.app.directive("editUserDirective", [function() {
		return {
			scope : {},
			controller: "MiddleController",
			controllerAs: "middle",
			templateUrl: "edit-user-tpl",
			link: function(scope, element, attrs) {

				var middle = scope.middle;

				scope.cancel = function() {
					middle.userService.setUser(null);
					middle.viewService.showUserList();
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

				scope.validateEditUser = function() {
					var valid = middle.userService.validateEditUser(middle.userService.user);
					if (valid.error) {
						scope.error = valid.error.message;
						return false;
					}

					scope.error = null;
					return true;
				};

				scope.editUser = function() {
					if (!scope.validateEditUser()) { return; }

					scope.isSubmitting = true;
					promise = middle.userService.editUser(middle.userService.user);
					promise.error(scope.setError).success(scope.showUserData);
				};

				scope.showUserData = function() {
					scope.isSubmitting = false;
					middle.viewService.showUserData(middle.userService.user);
					middle.userDataService.showUserData(middle.userService.user);
				};

				scope.setError = function(data, code) {
					scope.isSubmitting = false;
					if (code == 401) {
						//redirect to login
						window.location.href = "/login"
					} else if (code == 404) {
						//couldn't find student, reload page
						scope.error = {
							message: "Couldn't find the student. Please refresh the page"
						};
					} else {
						//show general error
						scope.error = {
							message: "General error. Please refresh the page."
						};
					}
				};

				scope.$watch("middle.userService.user", function() {
					scope.error = null;
				}, true);
			}
		};
	}]);
});
