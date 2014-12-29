var app, compound, goodAgent, goodToken, restauth, lessonApi, studentData
, request = require('supertest')
, sinon   = require('sinon')
, should = require('chai');

if(typeof(expect) === 'undefined'){ var expect = should.expect; }

describe('StudentController', function() {
    beforeEach(function(done) {
		console.log("********************");
		console.log(this.currentTest.title);

        app = getApp();
        compound = app.compound;
        compound.on('ready', function() {
			restauth = app.restauth();
            lessonApi = app.lessonApi();
            studentData = app.studentData();
        });

		goodUd = {
			user: 'jwang',
			pass: 'newtest',
		};

		app.login(request(app), goodUd, function(agent) {
			goodAgent = agent;

			var req = request(app).get("/students");	
			goodAgent.attachCookies(req);
			goodToken = app.requestCookies(req)['token'];

			done();
		});

    });

    it('redirects to login template on GET /students without cookie', function (done) {
		request(app).get("/students").end(function(err, obj) {
            expect(obj.res.headers["location"]).equals("/login");
			done();
		});
	});

	/*it returns correct view
	 * GET /users
     * Should render users/index.ejs
     */
    it('renders "index" template on GET /students', function (done) {
		var req = request(app).get("/students");	
		goodAgent.attachCookies(req);

        req.end(function (err, res) {
            var options = app.getRenderData( /students\/index\.jade$/i);

            expect(res.res.statusCode).equals(200);
            expect(app.didRender( /students\/index\.jade$/i)).equals(true);
			expect(options.students).to.be.ok;

            done();
        });
    });

	//it can get a list of students based on user id on index
	it('calls restauth.students with token', function (done) {
		var req = request(app).get("/students");	
		goodAgent.attachCookies(req);
		raTokenSpy = sinon.spy(restauth, "students");

        req.end(function (err, res) {
			expect(restauth.students.called).equals(true);
			expect(raTokenSpy.calledWith(goodToken.user_id, goodToken.value)).equals(true);
            done();
        });
    });

	//it can get a list of students using ajax
	it('can get a list of students using ajax via get /students/list', function (done) {
		raTokenSpy = sinon.spy(restauth, "students");

		request(app).get("/students/list").set({
			'authtoken': JSON.stringify(goodToken),
			'accept': 'application/json'
		}).end(function (err, obj) {
			expect(obj.res.body).to.be.ok;
			expect(obj.res.body.response).to.be.ok;
			expect(JSON.parse(obj.res.body.response)).to.be.ok;

			expect(restauth.students.called).equals(true);
			expect(raTokenSpy.calledWith(goodToken.user_id, goodToken.value)).equals(true);
            done();
        });
    });

	it('redirects to /students if non ajax call to /students/list is made', function(done) {
		raTokenSpy = sinon.spy(restauth, "students");

		request(app).get("/students/list").set({
			'authtoken': JSON.stringify(goodToken),
		}).end(function (err, obj) {
			//expect to redirect to students
            expect(obj.res.statusCode).equals(302);
            expect(obj.res.headers["location"]).equals("/students");

            done();
        });
	});

	//TODO can add student to school list
	it('can add a student at /students/add', function(done) {
        raTokenSpy = sinon.spy(restauth, "addStudent");

        var data = {
            set_password: false,
            fullname: 'mochatest',
            password: 'TestMocha',
            confirm: 'TestMocha',
            phone: '98765432100',
            email: 'Test@baidu.com'
        };

        request(app).post('/students/add').set({
            'authtoken': JSON.stringify(goodToken),
            'accept': 'application/json'
        }).send(data).end(function(err, obj){
            expect(restauth.addStudent.called).equals(true);
            expect(raTokenSpy.calledWith(goodToken.user_id, goodToken.value, data)).equals(true);
            expect(obj.res.statusCode).equals(200);

            done();
        });
	});

    it('can get errorMessage add a student at/students/add', function(done){
        raTokenSpy = sinon.spy(restauth, 'addStudent');
        var data = {
            set_password: false,
            fullname: '',
            password: 'TestMocha',
            confirm: 'TestMoch',
            phone: '98765432100',
            email: 'Testbaidu.com'
        };

        request(app).post('/students/add').set({
            'authtoken': JSON.stringify(goodToken),
            'accept': "application/json"
        }).send(data).end(function(err, obj){

            expect(obj.res.statusCode).equals(400);
            expect(obj.res.body).to.be.ok;
            expect(obj.res.body.message.fullname).equals('fullname is required');
            expect(obj.res.body.message.password).equals('password must be equals confirm');
            expect(obj.res.body.message.email).equals('email is not an email');
            done();
        });
    });


	//TODO can edit student
    it('can edit student message at /students/edit', function(done){

        raTokenSpy = sinon.spy(restauth, 'editStudent');

        var data = {
            username: 'test@baidu.com',
            fullname:'testmochaedit',
            phone:'1234567'
        };

        request(app).post('/students/edit').set({
            'authtoken': JSON.stringify(goodToken),
            'accept': "application/json"
        }).send(data).end(function(err, obj){

            expect(restauth.editStudent.called).equals(true);
            //expect(raTokenSpy.calledWith(goodToken.user_id, goodToken.value, data)).equals(true);
            expect(obj.res.statusCode).equals(200);
            done();
        });
     });

    //validate true but edit false
    it('can get error statusCode and log error at /students/edit', function(done){
        raTokenSpy = sinon.spy(restauth, 'editStudent');

        var data = {                //no have username
            fullname:'testmochaedit',
            phone:'1234567'
        };

        request(app).post('/students/edit').set({
            'authtoken': JSON.stringify(goodToken),
            'accept': "application/json"
        }).send(data).end(function(err, obj){

            //expect errorStatues code
            expect(obj.res.statusCode).equals(400);

            done();

        });
    });

	//it can get school student's summary
    it('it can get school student summary at /students/details', function(done){
        raTokenSpyLessonApi = sinon.spy(lessonApi, 'getSectionNames');
        raTokenSpyStudentData = sinon.spy(studentData, 'getDetailsById');

        request(app).post('/students/details').set({
            'authtoken': JSON.stringify(goodToken),
            'accept': "application/json"
        }).end(function(err, obj){

            expectValidStudentDetail(obj.res.body.response);
            // expect to have correct sectionName
            expectValidSectionDetail(obj.res.body.response.scores[0].section);

            expect(obj.res.body).to.be.ok;
            expect(obj.res.body.response).to.be.ok;
            expect(lessonApi.getSectionNames.called).equals(true);
            expect(studentData.getDetailsById.called).equals(true);

            done();
        });
    });

	//it will not get student's summary if student is not in school


    //it will get student section score
    it('it can get school student score at /students/usersSectionScore', function(done){

        raTokenSpyRestauth = sinon.spy(restauth, 'students');
        raTokenSpyStudentScore = sinon.spy(studentData, 'getUsersScore');
        raTokenSpyLessonApi = sinon.spy(lessonApi, 'getSectionNames');

        request(app).post('/students/usersSectionScore').set({
            'authtoken': JSON.stringify(goodToken),
            'accept': "application/json"
        }).end(function(err, obj){

            expectValidStudentScoreDetail(obj.res.body.response[0]);

            expect(obj.res.body).to.be.ok;
            expect(obj.res.body.response).to.be.ok;

            expect(restauth.students.called).equals(true);
            expect(lessonApi.getSectionNames.called).equals(true);
            expect(studentData.getUsersScore.called).equals(true);

            done();
        });
    });

    it("can get user history at /students/history", function(done){
        var length = 15;
        raTokenSpyRestauth = sinon.spy(restauth, 'students');
        raTokenSpyStudentData = sinon.spy(studentData, 'getUsersHistory');

        request(app).get('/students/history/'+length).set({
            'authtoken': JSON.stringify(goodToken),
            'accept': "application/json"
        }).end(function(err, obj){
            expect(obj.res.body).to.be.ok;
            expect(obj.res.body.response).to.be.ok;

            expectValidStudentHistory(obj.res.body.response[0]);

            expect(restauth.students.called).equals(true);
            expect(studentData.getUsersHistory.called).equals(true);
            done();
        });
    });

    it("can update user progress at /students/updateProgress", function(done) {
        var data ={
            user_id: 38,
            section_id: 110,
            chapter_id: 26
        };
        raTokenSpyStudentData = sinon.spy(studentData, 'updateUserProgress');

        request(app).post('/students/updateProgress').set({
            'authtoken': JSON.stringify(goodToken),
            'accept': "application/json"
        }).send(data).end(function(err, obj){
            expect(obj.res.body).to.be.ok;

            expect(studentData.updateUserProgress.called).equals(true);
            done();
        });
    });



});

function expectValidStudentDetail(student) {
    expect(student).to.have.property('goal');
    expect(student).to.have.property('userProgress');
    expect(student).to.have.property('scores');
    expect(student).to.have.property('averages');
}

function expectValidSectionDetail(section) {
    expect(section).to.have.property('id');
    expect(section).to.have.property('chapter_id');
    expect(section).to.have.property('number');
    expect(section).to.have.property('name');
    expect(section).to.have.property('image');
}

function expectValidStudentScoreDetail(studenScore) {
    expect(studenScore).to.have.property('score');
    expect(studenScore).to.have.property('section_id');
    expect(studenScore).to.have.property('latest_section');
    expect(studenScore).to.have.property('id');
    expect(studenScore).to.have.property('username');
    expect(studenScore).to.have.property('passport');
}

function expectValidStudentHistory(history) {
    expect(history).to.have.property('user_id');
    expect(history).to.have.property('change_text');
    expect(history).to.have.property('entry_time');
    expect(history).to.have.property('id');
    expect(history).to.have.property('avatar');
    expect(history).to.have.property('displayName');
}