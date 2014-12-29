
packager('academy.directives', function() {
	academy.app.directive("userHistoryListDirective", [function() {
		return {
			controller: "MiddleController",
			controllerAs: "middle",
			templateUrl: "user-history-list-tpl",
			link: function(scope, element, attrs) {

				var middle = scope.middle;

				scope.$watch(function() {
					return middle.userService.user;
				}, function() {
					if (!middle.userService.user) {
						return;
					}
					var promise = middle.historyService.getUserHistories([middle.userService.user]);
				});
			}
		};
	}]);
});
