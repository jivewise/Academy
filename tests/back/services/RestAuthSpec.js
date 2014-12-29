var http, restauth, config;
var config = require('./config');
http = require("http"), sinon = require('sinon'), chai = require('chai'), expect = chai.expect;

var serverLode = new config;
restauth = serverLode.restauth();
configData = serverLode.config();

describe("RestAuthService", function() {
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

	it("can get token", function() {
		var data = getTokenData;
		var passedData = requestSpy.firstCall.args[0];

		expectValidToken(testToken);

		expect(passedData.apiKey).to.equal(configData.restauth.keys.AUTH_APIKEY);
		expect(passedData.apiSecret).to.equal(configData.restauth.keys.AUTH_SECRET);
		expect(passedData.username).to.equal(data.username);
		expect(passedData.password).to.equal(data.password);
		expect(passedData.ipAddress).to.equal(data.ip);
		expect(passedData.rememberMe).to.equal(data.remember);

		//validate path, method, and request called
		expect(restauth.options.method).to.equal("POST");
		expect(restauth.options.path).to.equal("/tokens?writer=json");
		expect(requestSpy.calledOnce).to.equal(true);
	});

	it("can validate token", function(done) {
		var data = getTokenData, token = testToken;
		
		var error = function() {
			expect("ERROR VALIDATING TOKEN").equals("");
		};

		var success = function() {
			done();
		};

		restauth.validateToken(token.value, data.ip, success, error);

		var passedData = requestSpy.secondCall.args[0];

		//calls request with put
		expect(restauth.options.method).to.equal("PUT");
		expect(restauth.options.path).to.equal('/tokens/' + token.value + '?writer=json');
		expect(requestSpy.calledTwice).to.equal(true);
		expect(passedData.ipAddress).to.equal(data.ip);
	});

	it("can get passport list", function(done) {
		var success = function(response) {
			//expect passport array
			var passports = JSON.parse(response);
			if (passports.length) {
				expectValidPassport(passports[0]);
			}
			done();
		};

		var error = function() {
			expect("ERROR GETTING PASSPORTS").equals("");
		};
		var token = testToken;

		restauth.passports(token.user_id, token.value, success, error);

		var passedData = requestSpy.secondCall.args[0];
		expect(passedData.token).to.equal(token.value);
		expect(restauth.options.method).to.equal("GET");
		expect(restauth.options.path).to.equal('/applications/' + token.application 
					+ '/owner/' + token.user_id + '/passports/?writer=json');

	});

	//can get student list
	it("can get list of users", function(done) {
		var success = function(response) {
			//expect passport array
			var students = JSON.parse(response);
			if (students.length) {
				expectValidStudent(students[0]);
			}
			done();
		};

		var error = function() {
			expect("ERROR GETTING USERS").equals("");
		};

		var token = testToken;
		restauth.users(token.user_id, token.value, success, error);

		var passedData = requestSpy.secondCall.args[0];
		expect(passedData.token).to.equal(token.value);
		expect(restauth.options.method).to.equal("GET");
		expect(restauth.options.path).to.equal( '/applications/' + token.application 
					+ '/owner/' + token.user_id + '/users/?writer=json');
	});
	//TODO can edit student

    it('can edit a user', function(done){
        var success = function(response){
            done();
        };

        var error = function(){
            expect("ERROR EDIT A USER").equals('');
            done();
        };

        var data = {
            username: 'test@baidu.com',
            fullname:'servicetest',
            phone:'1234567800'
        };

        var token = testToken;
        restauth.editUser(token.user_id, token.value, data, success, error);

        var passedData = requestSpy.secondCall.args[0];
        expect(passedData.token).to.equal(token.value);
        expect(restauth.options.method).to.equal("POST");
        expect(restauth.options.path).to.equal( '/applications/' + token.application
            + '/owner/' + token.user_id + '/update-user/?writer=json');

    });

	//TODO can add student

    it('can add a user', function(done){
       var success = function(response){

           var student = JSON.parse(response);
           expectValidAddNewStudent(student);
           done();
       };

        var error = function(){
            expect("ERROR ADD A STUDENT").equals('');
            done();
        };

        var data = {
            set_password: false,
            fullname: 'TestService',
            password: 'TestMocha',
            confirm: 'TestMocha',
            phone: '98765432100',
            email: 'ServiceTest@baidu.com',
            notify_user: false
        };
        var token = testToken;
        restauth.addUser(token.user_id, token.value, data, success, error);

        var passedData = requestSpy.secondCall.args[0];
        expect(passedData.token).to.equal(token.value);
        expect(restauth.options.method).to.equal("POST");
        expect(restauth.options.path).to.equal( '/applications/' + token.application
            + '/owner/' + token.user_id + '/new-user/?writer=json');
    });

    //it can del user
    it("can del user", function(done){
        var success = function(response){
            done();
        };

        var error = function () {
            expect("ERROR CAN DEL USER").equals('');
        };
        var username = "test@baidu.com";
        var token = testToken;
        restauth.delUser(token.user_id, token.value, username, success, error);
    });

    //can get owner groups. Returns: group_id, group_name, json_data, num_members
    it("can get owner groups", function(done){
        var success = function(response){
            var ownerGroups = JSON.parse(response);
            if (ownerGroups.length) {
                expectValidGroupsDetail(ownerGroups[0]);
            }
            done();
        };

        var error = function(){
            expect("ERROR GET OWNER GROUPS").equals('');
            done();
        };
        var token = testToken;
        restauth.getOwnerGroups(token.user_id, token.value, success, error);

        var passedData = requestSpy.secondCall.args[0];
        expect(passedData.token).to.equal(token.value);
        expect(restauth.options.method).to.equal("GET");
        expect(restauth.options.path).to.equal('/owner/' + token.user_id + '/groups/?writer=json');
    });

    //can get group users by group_id
    it("can get group users", function(done){
        var success = function(response){
            var groupUsers = JSON.parse(response);
            if (groupUsers.length) {
                expectValidGroupUsers(groupUsers[0]);
            }
            done();
        };
        var error = function(){
            expect("ERROR GET GROUP USERS").equals('');
            done();
        };
        var token = testToken;
        var group_id = 209;
        restauth.getGroupUsers(token.user_id, token.value, group_id, success, error);

        var passedData = requestSpy.secondCall.args[0];
        expect(passedData.token).to.equal(token.value);
        expect(restauth.options.method).to.equal("GET");
        expect(restauth.options.path).to.equal('/owner/' + token.user_id + '/groups/'+group_id+'/users/?writer=json');
    });

    //can add owner group
    it("can add owner group success", function(done){
        var success = function(response){
            done();
        };
        var error = function(){
            expect('ERROR ADD OWNER GROUP').equals('');
        };
        var user_ids = [42,77];
        var data = {
            name: 'yutao5group',
            jaon_data: null,
            user_ids: user_ids,
            application:'whyyu_create'
        };
        var token = testToken;
        restauth.addOwnerGroup(token.user_id, token.value, data, success, error);
        var passedData = requestSpy.secondCall.args[0];
        expect(passedData.token).to.equal(token.value);
        expect(restauth.options.method).to.equal("POST");
        expect(restauth.options.path).to.equal('/owner/' + token.user_id + '/groups/add/?writer=json');
    });

    //can add users to group
    it('can add users to group success', function(done){
        var success = function(response){
            done();
        };
        var error = function(){
            expect('ERROR ADD USERS TO GROUP').equals('');
        };
        var data = {
            user_ids:[42,77]
        };
        var token = testToken;
        var group_id = 209;
        restauth.addUsersToGroup(token.user_id, token.value, group_id, data, success, error);

        var passedData = requestSpy.secondCall.args[0];
        expect(passedData.token).to.equal(token.value);
        expect(restauth.options.method).to.equal("POST");
        expect(restauth.options.path).to.equal('/owner/' + token.user_id + '/groups/' + group_id + '/addusers/?writer=json');
    });

    //can remove users from group
    it('can remove users from group success', function(done){
        var success = function(response){
            done();
        };
        var error = function(){
            expect('ERROR REMOVE USERS TO GROUP').equals('');
        };
        var data = {
            user_ids:[42,77]
        };
        var token = testToken;
        var group_id = 209;
        restauth.removeUserFromGroup(token.user_id, token.value, group_id, data, success, error);

        var passedData = requestSpy.secondCall.args[0];
        expect(passedData.token).to.equal(token.value);
        expect(restauth.options.method).to.equal("POST");
        expect(restauth.options.path).to.equal('/owner/' + token.user_id + '/groups/' + group_id + '/removeusers/?writer=json');
    });

    //owner can set group
    it("can set group by group_id success", function(done){
        var success = function(response){
            done();
        };
        var error = function(){
            expect('ERROR SET GROUP BY GROUP_ID').equals('');
        };
        var data = {
            json_data:"mochatest"
        };
        var token = testToken;
        var group_id = 209;
        restauth.setGroup(token.user_id, token.value, group_id, data, success, error);

        var passedData = requestSpy.secondCall.args[0];
        expect(passedData.token).to.equal(token.value);
        expect(restauth.options.method).to.equal("POST");
        expect(restauth.options.path).to.equal('/owner/' + token.user_id + '/groups/' + group_id + '/setgroup/?writer=json');
    });

    //owner can delete group by group_id
    it("can delete group by group_id success", function(done){
        var success = function(response){
            done();
        };
        var error = function(){
            expect('ERROR DELETE GROUP BY GROUP_ID').equals('');
        };

        var token = testToken;
        var group_id = 272;
        restauth.deleteGroup(token.user_id, token.value, group_id, success, error);

        var passedData = requestSpy.secondCall.args[0];
        expect(passedData.token).to.equal(token.value);
        expect(restauth.options.method).to.equal("DELETE");
        expect(restauth.options.path).to.equal('/owner/' + token.user_id + '/groups/' + group_id + '/deletegroup');
    });

    // can get a owner group
    it("can get a owner group success", function(done){
        var success = function(response){
            var ownerGroup = JSON.parse(response);
            if (ownerGroup.length) {
                expectValidGroupDetail(ownerGroup[0]);
            }
            done();
        };
        var error = function(){
            expect('ERROR GET A GROUP BY GROUP_ID').equals('');
        };

        var token = testToken;
        var group_id = 209;
        restauth.getOwnerGroup(token.user_id, token.value, group_id, success, error);

        var passedData = requestSpy.secondCall.args[0];
        expect(passedData.token).to.equal(token.value);
        expect(restauth.options.method).to.equal("GET");
        expect(restauth.options.path).to.equal('/owner/' + token.user_id + '/groups/' + group_id + '/group/?writer=json');
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

function expectValidPassport(passport) {
	expect(passport).to.have.property('id');
	expect(passport).to.have.property('user_id');
	expect(passport).to.have.property('application');
	expect(passport).to.have.property('code');
	expect(passport).to.have.property('start_dt');
	expect(passport).to.have.property('created_dt');
	expect(passport).to.have.property('activated_dt');
	expect(passport).to.have.property('affiliate_id');
	expect(passport).to.have.property('owner_id');
}

function expectValidStudent(student) {
	expect(student).to.have.property('id');
	expect(student).to.have.property('username');
	expect(student).to.have.property('role');
	expect(student).to.have.property('fullname');
	expect(student).to.have.property('email');
	expect(student).to.have.property('phone');
	expect(student).to.have.property('date_created');
	expect(student).to.have.property('passport');
}

function expectValidAddNewStudent(student){
    expect(student).to.have.property('id');
    expect(student).to.have.property('username');
    expect(student).to.have.property('role');
    expect(student).to.have.property('fullname');
    expect(student).to.have.property('email');
    expect(student).to.have.property('phone');
    expect(student).to.have.property('date_created');
}

function expectValidGroupDetail(group) {
    expect(group).to.have.property('id');
    expect(group).to.have.property('name');
    expect(group).to.have.property('application');
    expect(group).to.have.property('json_data');
}

function expectValidGroupUsers(user) {
    expect(user).to.have.property('user_id');
    expect(user).to.have.property('username');
    expect(user).to.have.property('group_id');
}

function expectValidGroupsDetail(group) {
    expect(group).to.have.property('group_id');
    expect(group).to.have.property('group_name');
    expect(group).to.have.property('num_numbers');
    expect(group).to.have.property('json_data');
}

