packager('academy.directives', function () {
	academy.app.directive("accountSummaryGraphDirective", ["UserService", "PassportService",  function(UserService, PassportService) {
		return {
			scope: {},
			controller: "RightController",
			controllerAs: "right",
			templateUrl: "account-summary-graph-tpl",
			link: function (scope, elem, attrs) {

				scope.passports = PassportService.passports;
				scope.users = UserService.users;

				var ctx = elem.children()[0].getContext('2d');

				function init() {
					setup();
					draw();
				}

				function setup() {
					chart = new Chart(ctx);
					Chart.defaults.global.animation = false;
					Chart.defaults.global.showTooltips = true;
				}

				function getDataSet() {
					return [{
						value: scope.users.length,
						color: "#F7464A",
						highlight: "#FF5A5E",
						label: "Passport in Use"
					}, {
						value: scope.passports.length - scope.users.length,
						color: "#46BFBD",
						highlight: "#5AD3D1",
						label: "Available Passports"
					}];
				}

				function draw() {
					if (scope.passports.length == 0 || scope.passports.length < scope.users.length) {
						return;
					}

					var data = getDataSet();

					scope.pieChart = chart.Pie(data);
				}

				scope.$watch("passports", function () {
					init();
				}, true);

				scope.$watch("users", function () {
					init();
				}, true);
			}
		};
	}]);
});