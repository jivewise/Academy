describe('StudentViewState', function() {
	var viewState;
	beforeEach(function() {
		module('schoolApp');
		
		inject(function(ViewStateService) {
			viewState = ViewStateService;
		});
	
	});

	it("can show add student", function() {
		viewState.showAddStudent();
		expect(viewState.isAddingShowing).toBe(true);
		expect(viewState.isEditingShowing).toBe(false);
		expect(viewState.isViewingStudentSummary).toBe(false);
		expect(viewState.studentListFull).toBe(false);

		expect(viewState.student.set_password).toBe(true);
		expect(viewState.student.fullname).toBe('');

		expect(viewState.master_student).toBe(null);
	});

	it("can show edit student", function() {
		var student = {test: true, fullname: 'test'};
		viewState.showEditStudent(student);
		expect(viewState.isAddingShowing).toBe(false);
		expect(viewState.isEditingShowing).toBe(true);
		expect(viewState.isViewingStudentSummary).toBe(false);
		expect(viewState.studentListFull).toBe(false);

		expect(viewState.student.test).toBe(true);
		expect(viewState.master_student).toBe(student);
	});

	it("can revert to default state", function() {
		viewState.revertToDefault();
		expect(viewState.isAddingShowing).toBe(false);
		expect(viewState.isEditingShowing).toBe(false);
		expect(viewState.isViewingStudentSummary).toBe(false);
		expect(viewState.studentListFull).toBe(true);

		expect(viewState.student).toBe(null);
		expect(viewState.master_student).toBe(null);
	});

	it("can show student summary", function() {
		var student = {test: true, fullname: ''};
		viewState.showStudentSummary(student);
		expect(viewState.isAddingShowing).toBe(false);
		expect(viewState.isEditingShowing).toBe(false);
		expect(viewState.isViewingStudentSummary).toBe(true);
		expect(viewState.studentListFull).toBe(false);

		expect(viewState.student.test).toBe(student.test);
		expect(viewState.student.fullname).toBe(student.fullname);
	});

	it("can hide add student button", function() {
		//when passports are full button should be hidden
		viewState.setPassportsFull(true);
		expect(viewState.hideAddStudents()).toBe(true);

		//when passports aren't full, hide add button should be false
		viewState.setPassportsFull(false);
		expect(viewState.hideAddStudents()).toBe(false);

		//when adding students, hide add button should be true
		viewState.showAddStudent();
		expect(viewState.hideAddStudents()).toBe(true);
	});

	it("can set viewing student state", function() {
		var student  = {id: 15, test: true};
		var other_student = {id: 30, test: false};

		viewState.showEditStudent(student);
		expect(viewState.isViewingStudent(student)).toBe(true);
		expect(viewState.isViewingStudent(other_student)).toBe(false);

		viewState.revertToDefault();
		expect(viewState.isViewingStudent(student)).toBeFalsy();

		viewState.showStudentSummary(student);
		expect(viewState.isViewingStudent(student)).toBe(true);
		expect(viewState.isViewingStudent(other_student)).toBe(false);
	});
});
