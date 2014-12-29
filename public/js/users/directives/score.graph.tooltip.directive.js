packager('academy.directives', function() {
	academy.app.directive("scoreGraphTooltipDirective", [function() {
		return {
			scope : {
				score: "="
			},
			templateUrl: "score-graph-tooltip-tpl",
			link: function(scope, element, attrs) {

				scope.update = function() {
					//get section data from pointNum
					var section = scope.score.section;
					scope.sectionImage = section.image;
					scope.sectionName = section.number + ". " + section.name;
					scope.grade = parseInt(scope.score.score, 10);
					scope.average = parseInt(scope.score.average, 10);
				};

				scope.render = function() {
					scope.update();
				};

				scope.$watch("score", function() {
					if (!scope.score) { return; }
					scope.render();
				});
			}
		};
	}]);
});
