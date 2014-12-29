
packager('academy.directives', function() {
	academy.app.directive("userDataDirective", [function() {
		return {
			controller: "MiddleController",
			controllerAs: "middle",
			templateUrl: "user-data-tpl",
			link: function(scope, element, attrs) {
			}
		};
	}]);
});
