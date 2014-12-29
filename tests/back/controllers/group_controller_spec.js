var app, compound, goodAgent, goodToken, restauth
, request = require('supertest')
, sinon   = require('sinon')
, should = require('chai');

if(typeof(expect) === 'undefined'){ var expect = should.expect; }

describe('GroupsController', function() {
    beforeEach(function(done) {
		console.log("********************");
		console.log(this.currentTest.title);

        app = getApp();
        compound = app.compound;
        compound.on('ready', function() {
			restauth = app.restauth();
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

     //render groups/index.jade, get all owner groups
    it('renders "index" template on GET /classes', function (done) {
		var req = request(app).get("/classes");
		goodAgent.attachCookies(req);

        req.end(function (err, res) {
            var options = app.getRenderData( /groups\/index\.jade$/i);

            expect(res.res.statusCode).equals(200);
            expect(app.didRender( /groups\/index\.jade$/i)).equals(true);
			expect(options.groups).to.be.ok;

            expectValidGroupsDetail(JSON.parse(options.groups)[0]);

            done();
        });
    });

    //it can get owner groups use ajax
    it("can get owner groups via ajax on GET /groups", function(done){
        raTokenSpy = sinon.spy(restauth, "getOwnerGroups");

        request(app).get("/groups").set({
            'authtoken': JSON.stringify(goodToken),
            'accept': 'application/json'
        }).end(function (err, obj) {
            expect(obj.res.body).to.be.ok;
            expect(obj.res.body.response).to.be.ok;
            expect(JSON.parse(obj.res.body.response)).to.be.ok;

            expect(restauth.getOwnerGroups.called).equals(true);
            expect(raTokenSpy.calledWith(goodToken.user_id, goodToken.value)).equals(true);
            done();
        });
    });

    it('redirects to /groups if non ajax call to /groups is made', function(done) {
        raTokenSpy = sinon.spy(restauth, "getOwnerGroups");

        request(app).get("/groups").set({
            'authtoken': JSON.stringify(goodToken)
        }).end(function (err, obj) {
            //expect to redirect to students
            expect(obj.res.statusCode).equals(302);
            expect(obj.res.headers["location"]).equals("/classes");

            done();
        });
    });

    //can get a owner group msg
    it('can get a owner group msg on GET/groups/group', function(done) {
        var data = {
            group_id: 209
        };
        raTokenSpy = sinon.spy(restauth, "getOwnerGroup");

        request(app).post("/groups/group").set({
            'authtoken': JSON.stringify(goodToken),
            'accept': 'application/json'
        }).send(data).end(function (err, obj) {

            expect(obj.res.body).to.be.ok;
            expect(obj.res.body.response).to.be.ok;
            expect(JSON.parse(obj.res.body.response)).to.be.ok;
            expect(restauth.getOwnerGroup.called).equals(true);

            expectValidGroupDetail(JSON.parse(obj.res.body.response)[0]);
            done();
        });
    });



   //can add owner group
    it('can add owner group on POST/groups/group/add', function(done){
        var data = {
            name: 'mochaTestGroup',
            data:{
                json_data: 'mochatestgroup',
                desc: ''
            },
            user_ids: [42,77]
        };
        raTokenSpy = sinon.spy(restauth, "addOwnerGroup");

        request(app).post("/groups/group/add").set({
            'authtoken': JSON.stringify(goodToken),
            'accept': 'application/json'
        }).send(data).end(function (err, obj) {
            expect(obj.res.statusCode).equals(200);
            expect(restauth.addOwnerGroup.called).equals(true);
            done();
        });
    });

    //can add users to owner group by group_id
    it('can add users to owner group on POST/groups/group/users/add', function(done){
        var data = {
            group_id: 729,
            user_ids: [42,77]
        };
        raTokenSpy = sinon.spy(restauth, "addUsersToGroup");

        request(app).post("/groups/group/users/add").set({
            'authtoken': JSON.stringify(goodToken),
            'accept': 'application/json'
        }).send(data).end(function (err, obj) {
            expect(obj.res.statusCode).equals(200);
            expect(restauth.addUsersToGroup.called).equals(true);
            done();
        });
    });


    // can remove users from owner group
    it("can remove users from group on POST/groups/group/users/del", function(done){
        var data = {
            group_id: 729,
            user_ids:[42,77]
        };
        raTokenSpy = sinon.spy(restauth, "removeUserFromGroup");

        request(app).post("/groups/group/users/del").set({
            'authtoken': JSON.stringify(goodToken),
            'accept': 'application/json'
        }).send(data).end(function (err, obj) {
            expect(obj.res.statusCode).equals(200);
            expect(restauth.removeUserFromGroup.called).equals(true);
            done();
        });

    });



    //can update owner group
    it("can set data of owner group on POST/groups/group/edit", function(done){
        var data = {
            group_id: 209,
            data: {
                json_data: 'mochasetdata'
            }
        };
        raTokenSpy = sinon.spy(restauth, "setGroup");

        request(app).post("/groups/group/edit").set({
            'authtoken': JSON.stringify(goodToken),
            'accept': 'application/json'
        }).send(data).end(function (err, obj) {
            expect(obj.res.statusCode).equals(200);
            expect(restauth.setGroup.called).equals(true);
            done();
        });
    });

    //can delete owner group
    it("can delete group of owner on POST/groups/group/del", function(done){
        var data = {
            group_id: 729
        };
        raTokenSpy = sinon.spy(restauth, "deleteGroup");

        request(app).post("/groups/group/del").set({
            'authtoken': JSON.stringify(goodToken),
            'accept': 'application/json'
        }).send(data).end(function (err, obj) {
            expect(obj.res.statusCode).equals(200);
            expect(restauth.deleteGroup.called).equals(true);
            done();
        });
    });

    //can get group users by group_id
    it("can get group users on POST/groups/group/users", function(done){
        raTokenSpy = sinon.spy(restauth, "getGroupUsers");
        var data = {
            group_id: 582
        };
        request(app).post("/groups/group/users").set({
            'authtoken': JSON.stringify(goodToken),
            'accept': 'application/json'
        }).send(data).end(function (err, obj) {

            expect(obj.res.body).to.be.ok;
            expect(obj.res.body.response).to.be.ok;

            done();
        });
    });


});

function expectValidGroupDetail(group) {
    expect(group).to.have.property('id');
    expect(group).to.have.property('name');
    expect(group).to.have.property('application');
    expect(group).to.have.property('json_data');
}

function expectValidGroupsDetail(group) {
    expect(group).to.have.property('group_id');
    expect(group).to.have.property('group_name');
    expect(group).to.have.property('num_numbers');
    expect(group).to.have.property('json_data');
}