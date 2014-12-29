describe('StudentServiceSpec', function() {
	var studentService, http, callbacks, httpBackend;
	beforeEach(function(done) {
		app = ngMidwayTester('schoolApp');
		studentService = app.inject('StudentService');
		
		callbacks = jasmine.createSpyObj('callbacks', ['success', 'error']);

	});
	it("can get student list", function(done) {
		var error = function() {
			//expect(callbacks.success).toHaveBeenCalled();
			expect(4).toBe(3);
			done();
		};
		var success = function() {
			//expect student list
			expect(3).toBe(3);
			done();
		};

		studentService.get().then(success, error)
	});
/*
	it("errors when no auth headers are set", function(done) {
		done();
	});*/
});
