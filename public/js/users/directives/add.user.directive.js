packager('academy.directives', function() {
	academy.app.directive("addUserDirective", [function() {
		return {
			scope : {},
			controller: "MiddleController",
			controllerAs: "middle",
			templateUrl: "add-user-tpl",
			link: function(scope, element, attrs) {

				var middle = scope.middle;

				scope.cancel = function() {
					middle.userService.setUser(null);
					middle.userDataService.setUser(null);
					middle.viewService.showUserList();
				};

				scope.validateAddUser = function() {
					var valid = middle.userService.validateAddUser(middle.userService.user);
					if (valid.error) {
						scope.error = valid.error.message;
						return false;
					}

					scope.error = null;
					return true;
				};

				$('input#set-password').on('change', function() {
					if ($(this).is(':checked')) {
						delete middle.userService.user.set_password;
						delete middle.userService.user.password;
						delete middle.userService.user.confirm;

						scope.generate_password = true;
					} else {
						middle.userService.user.set_password = true;
						middle.userService.user.password = '';
						middle.userService.user.confirm = '';

						scope.generate_password = false;
					}
					scope.$apply();
				});

				// help to add or remove password key from user data
				scope.generate_password = false;

				scope.addUser = function() {
					if (!scope.validateAddUser()) { return; }

					scope.isSubmitting = true;
					promise = middle.userService.addUser(middle.userService.user);
					promise.error(scope.setError).success(scope.showUserList);
				};

				// after adding a user; show user list
				scope.showUserList = function() {
					scope.isSubmitting = false;
					middle.viewService.showUserList();

					// reload passports after adding a user
					// this helps to update passports chart
					// safer than only compare user number in a browser
					middle.passportService.getPassports();
				};

				scope.setError = function(data, code) {
					scope.isSubmitting = false;
					if (code == 409) {
						scope.error = {
							message: "Conflict. Student already exist and belong to a school."
						};
					} else if (code == 401) {
						//redirect to login
						window.location.href = "/login"
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

