packager('academy.directives', function() {
	academy.app.directive("userListDirective", [function() {
		return {
			controller: "LeftController",
			controllerAs: "left",
			templateUrl: "user-list-tpl",
			link: function(scope, element, attrs) {

				var left = scope.left;

				scope.showAddUser = function() {

					// when adding a user, build user object keys
					// so we can validate user according to these keys
					// if we generate password checkbox is checked,
					// set_password, password, confirm are deleted from user object dynamically
					var user = {
						fullname: '',
						email: '',
						phone: '',
						set_password: true,
						password: '',
						confirm: ''
					};

					left.userService.setUser(user);
					left.userDataService.setUser(null);
					left.viewService.showAddUser();
				};
			}
		};
	}]);
});
