packager('academy.directives', function() {
	academy.app.directive("academyInputDirective", [function() {
		return {
			scope: {
				inputModel : '=',
				inputId : '@',
				inputLabel : '@',
				inputError : '=',
				inputType: '@'
			},
			templateUrl: "academy-input-tpl",
			transclude: true,
			link: function(scope, element, attrs) {
			}
		};
	}]);
});
