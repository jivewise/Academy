var app, compound, goodAgent, goodToken, restauth
, request = require('supertest')
, sinon   = require('sinon'), should = require('chai');

if (typeof(expect) === 'undefined') { var expect = should.expect; }

describe('ForgotController', function() {
    beforeEach(function(done) {
        console.log("********************");
        console.log(this.currentTest.title);

        app = getApp();
        compound = app.compound;
        compound.on('ready', function() {
            //restauth = app.restauth();
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

    it('renders "index" template on GET /forgot', function(done){

        var req = request(app).get('/forgot');
        goodAgent.attachCookies(req);

        req.end(function(err, obj){
            var options = app.getRenderData(/forgot\/index\.jade$/i);

            expect(obj.res.statusCode).equals(200);
            expect(app.didRender(/forgot\/index\.jade$/i)).equals(true);
            expect(options.title).to.be.ok;
            done();
        });
    });



});

