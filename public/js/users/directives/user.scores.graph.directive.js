packager('academy.directives', function() {
	academy.app.directive("userScoresGraphDirective", ["UserDataService", function(UserDataService) {
		return {
			scope : {},
			controller: "MiddleController",
			controllerAs: "middle",
			templateUrl: "user-scores-graph-tpl",
			link: function(scope, element, attrs) {

				// data in this scope is complicated;
				// using controllerAs syntax causes vast errors;
				scope.scoreData = UserDataService.scoreData;

				// set the size of the chart on page load to make it responsive
				// fix canvas display on iOS on responsive
				if ($(window).width() < 480) {
					$canvas = $('canvas#scores-graph');
					var canvas_width = $canvas.parent().width() * 0.98;
					var canvas_height = canvas_width * 0.5;

					$canvas.attr('style', "width:"+canvas_width+ "px!important;height:"+canvas_height+"px!important;");
				} else {
					var canvas_width = $('#left-ctrl').width() * 0.98;
					var canvas_height = canvas_width * 0.3;

					$('canvas#scores-graph').attr('width', canvas_width).attr('height', canvas_height);
				}

				var ctx = $('#scores-graph')[0].getContext('2d');

				scope.tooltip = $('#scores-tooltip')[0];
				scope.scoreColor = '143, 209, 0';
				scope.averageColor = '52, 152, 219';
				scope.displayTooltip = false;

				scope.init = function() {
					scope.setup();
					scope.draw();
				};

				scope.setup = function() {
					scope.chart = new Chart(ctx);
					Chart.defaults.global.responsive = false;
					Chart.defaults.global.showTooltips = false;
				};

				scope.getDataSet = function(label, color, data) {
					return {
								label: label,
								fillColor: "rgba(" + color + ",0.2)",
								strokeColor: "rgba(" + color + ",1)",
								pointColor: "rgba(" + color + ",1)",
								pointStrokeColor: "#fff",
								pointHighlightFill: "#fff",
								pointHighlightStroke: "rgba(" + color + ",1)",
								data: data
							};
				};

				scope.draw = function() {
					// if score data is less than 3, do not draw chart
					if (!scope.scoreData.scores.length || scope.scoreData.scores.length < 3) {
						return;
					}
					var data = {
						labels: scope.scoreData.labels,
						datasets: [
							scope.getDataSet("Student Grades", scope.scoreColor, scope.scoreData.scores),
							scope.getDataSet("Student Averages", scope.averageColor, scope.scoreData.averages)
						]
					};

					scope.lineChart = scope.chart.Line(data, {
						 bezierCurveTension : 0.2
					});
				};

				scope.updateTooltip = function(e) {
					if (!UserDataService.scoreData.scores || UserDataService.scoreData.scores.length < 4) { return; }
					scope.renderTooltip(scope.lineChart.getPointsAtEvent(e));
				};

				scope.renderTooltip = function(points) {
					if (!points.length) { 
						scope.hideTooltip();
						return; 
					}

					var point = points[0];

					scope.showTooltip();
					scope.updateTipPosition(point);
					scope.pointScore = scope.getPointScore(point);
				};

				scope.getPointScore = function(point) {
					var index = scope.lineChart.datasets[0].points.indexOf(point);
					index = index == -1 ? scope.lineChart.datasets[1].points.indexOf(point) : index;

					return scope.scoreData.data[index];
				};

				scope.updateTipPosition = function(point) {
					//get the point coordinates
					if (scope.chart.width > point.x + 250) {
						scope.tipX = point.x + 10;
					} else {
						var left = point.x - 130;
						scope.tipX = left < 0 ? 10 : left;
					}

					scope.tipY = point.y > scope.chart.height * 0.4 ? point.y - 70 : point.y;

					scope.tipX += "px";
					scope.tipY += "px";
				};

				scope.showTooltip = function() {
					scope.displayTooltip = true;
				};
	
				scope.hideTooltip = function() {
					setTimeout(function() {
						scope.displayTooltip = false;
					}, 10);
				};

				scope.$watch("scoreData", function() {
					scope.init();
				}, true);
			}
		};
	}]);
});
