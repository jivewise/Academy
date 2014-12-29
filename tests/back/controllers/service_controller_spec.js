var app, compound, restauthSpy, goodUd, goodAgent = null, badUd, badAgent = null
, request = require('supertest')
, sinon   = require('sinon'), should = require('chai'), restauth;

describe('ServiceController', function() {
    beforeEach(function(done) {
		console.log("********************");
		console.log(this.currentTest.title);

        app = getApp();
        compound = app.compound;
        compound.on('ready', function() {
			restauth = app.restauth();
			raTokenSpy = sinon.spy(restauth, "validateToken");
        });

		goodUd = {
			user: 'jwang',
			pass: 'newtest',
		};

		app.login(request(app), goodUd, function(agent) {
			goodAgent = agent;
			done();
		});
	});

	it('should call restauth validate token with parameters', function(done) {
		var req = request(app).get("/validateToken");	
		goodAgent.attachCookies(req);
		var token = app.requestCookies(req)['token'].value
		req.end(function(err, obj) {
			expect(restauth.validateToken.called).equals(true);
			expect(raTokenSpy.calledWith(token, '127.0.0.1')).equals(true);
			done();
		});
	});

	it('should validate token in cookie', function(done) {
		var req = request(app).get("/validateToken");
		goodAgent.attachCookies(req);
		req.end(function(err, obj) {
			expect(obj.res.statusCode).equals(200);
			done();
		});
	});

	it('should validate token in header', function(done) {
		var req = request(app).get("/validateToken");
		goodAgent.attachCookies(req);
		var token = app.requestCookies(req)['token'];
		request(app).get("/validateToken").set({'authtoken': JSON.stringify(token)}).end(function(err, obj) {
			expect(obj.res.statusCode).equals(200);
			done();
		});
	});

	it('should redirect to login w/ bad token and request does not have ajax header', function(done) {
		request(app).get("/validateToken").end(function(err, obj) {
			expect(obj.res.statusCode).equals(302);
            expect(obj.res.headers["location"]).equals("/login");
			done();
		});
	});

	it('should send 403 on invalid token if the request has ajax header', function(done) {
		request(app).get("/validateToken").set({'accept': 'application/json'}).end(function(err, obj) {
			expect(obj.res.statusCode).equals(401);
			done();
		});
	});
});
