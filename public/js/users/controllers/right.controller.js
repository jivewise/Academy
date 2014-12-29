packager('academy.controllers', function() {
	academy.app.controller("RightController", ["UserService", "PassportService", "HistoryService", "ViewService", function(UserService, PassportService, HistoryService, ViewService) {

		var vm = this;

		vm.userService = UserService;
		vm.passportService = PassportService;
		vm.historyService = HistoryService;
		vm.viewService = ViewService;
	}]);
});