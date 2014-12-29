packager('academy.directives', function() {
	academy.app.directive("userListItemDirective", [function() {
		return {
			controller: "LeftController",
			controllerAs: "left",
			templateUrl: "user-list-item-tpl",
			link: function(scope, element, attrs) {

				var left = scope.left;

				scope.showUserData = function(user) {
					left.viewService.showUserData();
					left.userService.setUser(user);
					left.userDataService.showUserData(user);
				};
			}
		};
	}]);
});
