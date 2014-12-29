packager('academy.directives', function() {
	academy.app.directive("userSectionDirective", [function() {
		return {
			scope: {},
			controller: "MiddleController",
			controllerAs: "middle",
			templateUrl: "user-section-tpl",
			link: function(scope, element, attrs) {

			}
		};
	}]);
});
