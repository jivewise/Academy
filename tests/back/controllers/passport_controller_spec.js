var app, compound, goodAgent, goodToken
, request = require('supertest')
, sinon   = require('sinon'),should = require('chai');

if (typeof(expect) === 'undefined') { var expect = should.expect; }

describe('PassportController', function() {
    beforeEach(function(done) {
		console.log("********************");
		console.log(this.currentTest.title);

        app = getApp();
        compound = app.compound;
        compound.on('ready', function() {
        });

		goodUd = {
			user: 'jwang',
			pass: 'newtest'
		};

		app.login(request(app), goodUd, function(agent) {
			goodAgent = agent;

			var req = request(app).get("/students");	
			goodAgent.attachCookies(req);
			goodToken = app.requestCookies(req)['token'];

			done();
		});

    });

	//can get all passports
	it('can get a list of student passports at /passports', function (done) {
		var ra = app.restauth();
		raTokenSpy = sinon.spy(ra, "passports");

		request(app).get("/passports").set({
			'authtoken': JSON.stringify(goodToken),
			'accept': 'application/json'
		}).end(function (err, obj) {

			expect(obj.res.body).to.be.ok;
			expect(obj.res.body.response).to.be.ok;
			expect(JSON.parse(obj.res.body.response)).to.be.ok;
            console.log(JSON.parse(obj.res.body.response));

			expect(ra.passports.called).equals(true);
			expect(raTokenSpy.calledWith(goodToken.user_id, goodToken.value)).equals(true);
            done();
        });
	});

	it('redirects to /students if non ajax call to /passports is made', function(done) {
		request(app).get("/passports").set({
			'authtoken': JSON.stringify(goodToken)
		}).end(function (err, obj) {
			//expect to redirect to students
            expect(obj.res.headers["location"]).equals("/students");
            done();
        });
	});
});
