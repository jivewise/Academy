var http, studentData, restauth;
var config = require('./config');
http = require("http"), sinon = require('sinon'), chai = require('chai'), expect = chai.expect;

var serverLode = new config;
restauth = serverLode.restauth();
studentData = serverLode.studentData();

describe("StudentsController", function() {
	var getTokenData, requestSpy, testToken;
	beforeEach(function(done) {
		getTokenData = {
			username: "jwang",
			password: "newtest",
			ip: "127.0.0.1",
			remember: "false"
		};
		requestSpy = sinon.spy(restauth, "request");

		var data = getTokenData;
		var success = function(token) {
			testToken = JSON.parse(token);
			done();
		};

		var error = function() {
			expect("ERROR GETTING TOKEN").equals("");
		};

		restauth.getToken(data.username, data.password, data.ip, data.remember, success, error);
	});

    afterEach(function() {
        restauth.request.restore();
    });

	it("can get student details by id", function(done) {
        var success = function(response){
            var student = JSON.parse(response);
            expectValidStudentDetail(student);
          done();
        };

        var error = function(){
            expect('ERROR GET STUDENT DETAILS BY ID').equals('');
        };

        var token = testToken;

        studentData.getDetailsById(token.user_id, token.value, success, error);

        expect(studentData.options.method).to.equal("POST");
        expect(studentData.options.path).to.equal('/api/users/details');
	});

    it("can get user section score", function(done) {
        var success = function(response){
            var scores = JSON.parse(response);
            expectValidStudentScore(scores.user_38);
            done();
        };

        var error = function(){
            expect('ERROR GET STUDENT SECTION SCORE BY IDS').equals('');
        };

        var token = testToken;

        studentData.getUsersScore(token.user_id, token.value, success, error);

        expect(studentData.options.method).to.equal("POST");
        expect(studentData.options.path).to.equal('/api/users/summaries');
    });

    it("can get students history", function(done) {
        var success = function(response){
            var history = JSON.parse(response);
            expectValidStudentHistory(history[0]);
            done();
        };

        var error = function(){
            expect('ERROR GET HISTORY BY IDS').equals('');
        };

        var token = testToken;

        studentData.getUsersHistory([token.user_id], token.value, 10 , success, error);

        expect(studentData.options.method).to.equal("POST");
        expect(studentData.options.path).to.equal("/userHistory/getRecentActivities/"+token.value);
    });

    it("can update user progress by user_id ", function(done) {
        var success = function(response){
            done();
        };

        var error = function(){
            expect('ERROR UPDATE USER PROGRESS BY ID').equals('');
        };

        var token = testToken;
        var data = {
            user_id: token.user_id,
            section_id: 110,
            chapter_id: 26
        };

        studentData.updateUserProgress(data.user_id, data.section_id, data.chapter_id, token.value, success, error);

        expect(studentData.options.method).to.equal("POST");
        expect(studentData.options.path).to.equal("/api/users/setCurrentSection");
    });


    it("can get user progress by user_id ", function(done) {
        var success = function(response){
            expectValidStudentCurrentSection(JSON.parse(response));
            done();
        };

        var error = function(){
            expect('ERROR GET USER PROGRESS BY ID').equals('');
        };

        var token = testToken;
        var data = {
            user_id: token.user_id
        };

        studentData.getUserProgress(data.user_id, token.value, success, error);

        expect(studentData.options.method).to.equal("POST");
        expect(studentData.options.path).to.equal("/api/users/getCurrentSection");
    });

    it("can get users section scores ", function(done) {
        var success = function(response){
            expect(JSON.parse(response)).to.be.ok;
            done();
        };

        var error = function(){
            expect('ERROR GET USER PROGRESS BY ID').equals('');
        };

        var token = testToken;
        var data = {
            user_ids: [77,38,42],
            fullname: ["baidu","jwang","lili"],
            section_id: 645
        };

        studentData.getUsersSectionScore(data.user_ids, data.fullname, data.section_id, token.value, success, error);

        expect(studentData.options.method).to.equal("POST");
        expect(studentData.options.path).to.equal("/usersSection/scores");
    });

});

function expectValidStudentDetail(student) {
	expect(student).to.have.property('goal');
	expect(student).to.have.property('userProgress');
	expect(student).to.have.property('scores');
	expect(student).to.have.property('averages');
}

function expectValidStudentScore(student) {
    expect(student).to.have.property('user_id');
    expect(student).to.have.property('section_id');
    expect(student).to.have.property('score');
    expect(student).to.have.property('date_modified');
}

function expectValidStudentHistory(student) {
    expect(student).to.have.property('user_id');
    expect(student).to.have.property('change_text');
    expect(student).to.have.property('avatar');
    expect(student).to.have.property('displayName');
    expect(student).to.have.property('entry_time');
}

function expectValidStudentCurrentSection(student) {
    expect(student).to.have.property('user_id');
    expect(student).to.have.property('section_id');
    expect(student).to.have.property('content_type');
    expect(student).to.have.property('chapter_id');
}
