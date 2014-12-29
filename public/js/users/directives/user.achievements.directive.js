packager('academy.directives', function() {
	academy.app.directive("userAchievementsDirective", [function() {
		return {
			scope: {},
			controller: "MiddleController",
			controllerAs: "middle",
			templateUrl: "user-achievements-tpl",
			link: function(scope, element, attrs) {

				var middle = scope.middle;
			}
		};
	}]);
});
