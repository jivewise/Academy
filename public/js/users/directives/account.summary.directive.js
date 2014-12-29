packager('academy.directives', function () {
	academy.app.directive("accountSummaryDirective", [function() {
		return {
			scope: {},
			controller: "RightController",
			controllerAs: "right",
			templateUrl: "account-summary-tpl",
			link: function (scope, elem, attrs) {
			}
		};
	}]);
});