var app, compound, goodAgent, goodToken, restauth, lessonApi, studentData
, request = require('supertest')
, sinon   = require('sinon')
, should = require('chai');

if(typeof(expect) === 'undefined'){ var expect = should.expect; }

describe('UsersController', function() {
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
            var options = app.getRenderData( /users\/index\.jade$/i);

            expect(res.res.statusCode).equals(200);
            expect(app.didRender( /users\/index\.jade$/i)).equals(true);
			expect(JSON.parse(options.users)).to.be.ok;

            expectValidStudentScoreDetail(JSON.parse(options.users)[0]);

            done();
        });
    });


	//it can get a list of students based on user id on index
	it('calls restauth.users with token', function (done) {
		var req = request(app).get("/students");	
		goodAgent.attachCookies(req);
		raTokenSpy = sinon.spy(restauth, "users");

        req.end(function (err, res) {
			expect(restauth.users.called).equals(true);
			expect(raTokenSpy.calledWith(goodToken.user_id, goodToken.value)).equals(true);
            done();
        });
    });

	//it can get a list of students using ajax
	it('can get a list of students using ajax via get /users', function (done) {
		raTokenSpy = sinon.spy(restauth, "users");

		request(app).get("/users").set({
			'authtoken': JSON.stringify(goodToken),
			'accept': 'application/json'
		}).end(function (err, obj) {
			expect(obj.res.body).to.be.ok;
			expect(obj.res.body.response).to.be.ok;
			expect(JSON.parse(obj.res.body.response)).to.be.ok;

			expect(restauth.users.called).equals(true);
			expect(raTokenSpy.calledWith(goodToken.user_id, goodToken.value)).equals(true);
            done();
        });
    });

	it('redirects to /students if non ajax call to /users is made', function(done) {
		raTokenSpy = sinon.spy(restauth, "users");

		request(app).get("/users").set({
			'authtoken': JSON.stringify(goodToken)
		}).end(function (err, obj) {
			//expect to redirect to students
            expect(obj.res.statusCode).equals(302);
            expect(obj.res.headers["location"]).equals("/students");

            done();
        });
	});


	//TODO can add student to school list
	it('can add a student at /users/user/add', function(done) {
        this.timeout(8000);
        raTokenSpy = sinon.spy(restauth, "addUser");

        var data = {
            set_password: false,
            fullname: 'mochatest',
            password: 'TestMocha',
            confirm: 'TestMocha',
            phone: '98765432100',
            email: 'Test@baidu.com'
        };

        request(app).post('/users/user/add').set({
            'authtoken': JSON.stringify(goodToken),
            'accept': 'application/json'
        }).send(data).end(function(err, obj){
            expect(restauth.addUser.called).equals(true);
            expect(obj.res.statusCode).equals(200);

            done();
        });
	});

    it("can del user at POST/users/user/del", function(done) {
        var data = {
            username: "test@baidu.com"
        };

        raTokenSpyRestauth = sinon.spy(restauth, 'delUser');
        request(app).post('/users/user/del').set({
            'authtoken': JSON.stringify(goodToken),
            'accept': "application/json"
        }).send(data).end(function(err, obj){

            expect(restauth.delUser.called).equals(true);
            done();
        });
    });

    it('can get errorMessage add a student at/users/user/add', function(done){
        raTokenSpy = sinon.spy(restauth, 'addUser');
        var data = {
            set_password: false,
            fullname: '',
            password: 'TestMocha',
            confirm: 'TestMoch',
            phone: '98765432100',
            email: 'Testbaidu.com'
        };

        request(app).post('/users/user/add').set({
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
    it('can edit student message at /users/user/edit', function(done){

        raTokenSpy = sinon.spy(restauth, 'editUser');

        var data = {
            username: 'test@baidu.com',
            fullname:'testmochaedit',
            phone:'1234567'
        };

        request(app).post('/users/user/edit').set({
            'authtoken': JSON.stringify(goodToken),
            'accept': "application/json"
        }).send(data).end(function(err, obj){

            expect(restauth.editUser.called).equals(true);
            //expect(raTokenSpy.calledWith(goodToken.user_id, goodToken.value, data)).equals(true);
            expect(obj.res.statusCode).equals(200);
            done();
        });
     });

    //validate true but edit false
    it('can get error statusCode and log error at /users/user/edit', function(done){
        raTokenSpy = sinon.spy(restauth, 'editUser');

        var data = {                //no have username
            fullname:'testmochaedit',
            phone:'1234567'
        };

        request(app).post('/users/user/edit').set({
            'authtoken': JSON.stringify(goodToken),
            'accept': "application/json"
        }).send(data).end(function(err, obj){

            //expect errorStatues code
            expect(obj.res.statusCode).equals(400);

            done();

        });
    });

	//it can get school student's summary
    it('it can get school student summary at /users/user/scores', function(done){
        raTokenSpyLessonApi = sinon.spy(lessonApi, 'getSectionNames');
        raTokenSpyStudentData = sinon.spy(studentData, 'getDetailsById');
        var data = {
            user_id: '38'
        };

        request(app).post('/users/user/scores').set({
            'authtoken': JSON.stringify(goodToken),
            'accept': "application/json"
        }).send(data).end(function(err, obj){

            expectValidStudentDetail(JSON.parse(obj.res.body.response));
            // expect to have correct sectionName
            expectValidSectionDetail(JSON.parse(obj.res.body.response).scores[0].section);

            expect(obj.res.body).to.be.ok;
            expect(obj.res.body.response).to.be.ok;
            expect(lessonApi.getSectionNames.called).equals(true);
            expect(studentData.getDetailsById.called).equals(true);

            done();
        });
    });


    it("can get user history at /users/histories", function(done){
        var data = {
            length: 15
        };
        raTokenSpyRestauth = sinon.spy(restauth, 'users');
        raTokenSpyStudentData = sinon.spy(studentData, 'getUsersHistory');

        request(app).post('/users/histories').set({
            'authtoken': JSON.stringify(goodToken),
            'accept': "application/json"
        }).send(data).end(function(err, obj){
            expect(obj.res.body).to.be.ok;
            expect(obj.res.body.response).to.be.ok;

            expectValidStudentHistory(JSON.parse(obj.res.body.response)[0]);

            expect(restauth.users.called).equals(true);
            expect(studentData.getUsersHistory.called).equals(true);
            done();
        });
    });

    it("can update user progress at /users/user/section/edit", function(done) {
        var data ={
            user_id: 38,
            section_id: 113,
            chapter_id: 26
        };
        raTokenSpyStudentData = sinon.spy(studentData, 'updateUserProgress');

        request(app).post('/users/user/section/edit').set({
            'authtoken': JSON.stringify(goodToken),
            'accept': "application/json"
        }).send(data).end(function(err, obj){
            expect(obj.res.body).to.be.ok;

            expect(studentData.updateUserProgress.called).equals(true);
            done();
        });
    });

    it("can get user progress at /users/user/section", function(done) {
        var data ={
            user_id: 38,
        };
        raTokenSpyStudentData = sinon.spy(studentData, 'getUserProgress');

        request(app).post('/users/user/section').set({
            'authtoken': JSON.stringify(goodToken),
            'accept': "application/json"
        }).send(data).end(function(err, obj){
            expect(obj.res.body).to.be.ok;
            expect(obj.res.body.response).to.be.ok;

            expect(studentData.getUserProgress.called).equals(true);
            done();
        });
    });

    it("can get users section score at POST/users/sections/section/scores", function(done){
        var data = {
            section_id: 645
        };
        raTokenSpyRestauth = sinon.spy(restauth, 'users');
        raTokenSpyStudentData = sinon.spy(studentData, 'getUsersSectionScore');

        request(app).post('/users/sections/section/scores').set({
            'authtoken': JSON.stringify(goodToken),
            'accept': "application/json"
        }).send(data).end(function(err, obj){
            expect(obj.res.body).to.be.ok;
            expect(obj.res.body.response).to.be.ok;
            console.log(JSON.parse(obj.res.body.response));


            expect(restauth.users.called).equals(true);
            expect(studentData.getUsersSectionScore.called).equals(true);
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