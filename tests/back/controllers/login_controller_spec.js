var app, compound, restauthSpy, restauth
, request = require('supertest')
, sinon   = require('sinon'), should = require('chai');

if (typeof(expect) === 'undefined') { var expect = should.expect; }

describe('LoginController', function() {
	var goodUd = {
		user: 'jwang',
		pass: 'newtest'
	};

    beforeEach(function(done) {
		console.log("********************");
		console.log(this.currentTest.title);

        app = getApp();
        compound = app.compound;
        compound.on('ready', function() {
			restauth = app.restauth();
			raTokenSpy = sinon.spy(restauth, "getToken");
            done();
        });
    });

	it('should call create token on /login/post', function(done) {

		request(app).post("/login/post").send(goodUd).end(function(err, obj) {
			//expect correct functions to have been called
			expect(raTokenSpy.called).equals(true);
			expect(raTokenSpy.calledWith(goodUd.user, goodUd.pass, '127.0.0.1')).equals(true);

			//expect to redirect to students
            expect(obj.res.statusCode).equals(302);

            expect(obj.res.headers["location"]).equals("/students");

			//expect session token to be set
			var escaped = unescape(obj.res.headers["set-cookie"][0].split(";")[0].split("=")[1]);
			var token = JSON.parse(escaped);
			expectValidToken(token);

			done();
		});
	});

	//it can return unauthorized error on empty passwords
	it('should return 302 on no username to /login/post and redirect to login', function(done) {
		//look into wildcards in nock
		var badUd = {
			user: 'jwang',
			pass: '',
			remember: false
		};
		request(app).post("/login/post").send(badUd).end(function(err, obj) {
            obj.res.headers["location"].should.equal("/login");
			done();
		});
	});

	//it returns correct index view on /login 
    it('should render "index" template on GET /login', function (done) {
        request(app)
        .get('/login')
        .end(function (err, res) {
            expect(res.statusCode).equals(200);
            app.didRender(/login\/index\.jade$/i).should.be.true;
            done();
        });
    });
	

	it('should login via ajax route', function(done) {
		request(app)
		.post("/login/ajax").send(goodUd).end(function (err, obj) {
			expectValidToken(JSON.parse(obj.res.body.response));
			done();
		});
	});
});

function expectValidToken(token) {
	expect(token).to.have.property('id');
	expect(token).to.have.property('value');
	expect(token).to.have.property('username');
	expect(token).to.have.property('application');
	expect(token).to.have.property('user_id');
	expect(token).to.have.property('groupMemberships');
	expect(token).to.have.property('passportValidNumDays');
	expect(token).to.have.property('passportExpired');
	expect(token).to.have.property('date_updated');
	expect(token).to.have.property('token_length');
	expect(token).to.have.property('ip_address');
}
