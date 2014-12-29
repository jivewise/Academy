packager('academy.directives', function() {
	academy.app.directive("userScoresListDirective", [function() {
		return {
			scope : {},
			controller: "MiddleController",
			controllerAs: "middle",
			templateUrl: "user-scores-list-tpl",
			link: function(scope, element, attrs) {

				var middle = scope.middle;

				scope.score_list = [];

				scope.updateScoreList = function() {
					var scoreData = middle.userDataService.scoreData.data;

					if (scoreData.length == 0) {
						scope.score_list.length = 0;
						return;
					}

					_.each(scoreData, function(item, index) {
						scope.score_list.push({
							section_name: item.section.name,
							section_score: item.score,
							section_average: item.average
						});
					});
				};

				scope.$watch(function() {
					return middle.userDataService.scoreData;
				}, function() {
					scope.updateScoreList();
				}, true);

			}
		};
	}]);
});
