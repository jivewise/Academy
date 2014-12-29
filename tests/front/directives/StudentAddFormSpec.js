describe('StudentAddFormSpec', function() {
	var studentService, html, viewState, scope, elem, compiled;

	beforeEach(function() {
		module('schoolApp');
		
		inject(function(StudentService, ViewStateService, $compile, $rootScope, $templateCache) {
			html = '<div data-ng-controller="MiddleCtrl"><div data-student-add-form data-view-state="viewState" data-student-service="StudentService"></div></div>';

			//setup directive for tests
			scope = $rootScope;
			elem = angular.element(html);
			compiled = $compile(elem)(scope);
			scope.$digest();
		
			//set service mocks
			studentService = StudentService;
			viewState = ViewStateService;
		});
	});

	it("can update adding view", function() {
		console.log(scope.updateView);
		//expect(typeof(scope.updateView) === "function").toBe(true);
	});

	it("can validate fullname", function() {
	});

	it("can validate username as email", function() {
	});

	it("can validate phone number", function() {
	});

	it("can validate passwords", function() {
	});
});

