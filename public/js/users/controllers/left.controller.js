packager('academy.controllers', function() {
	academy.app.controller("LeftController", ["UserService", "UserDataService", "PassportService", "ViewService", function(UserService, UserDataService, PassportService, ViewService) {

		var vm = this;

		vm.userService = UserService;
		vm.userDataService = UserDataService;
		vm.passportService = PassportService;
		vm.viewService = ViewService;
	}]);
});