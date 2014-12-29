
packager('academy.directives', function() {
	academy.app.directive("historyListDirective", [function() {
		return {
			templateUrl: "history-list-tpl",
			link: function(scope, element, attrs) {
			}
		};
	}]);
});
