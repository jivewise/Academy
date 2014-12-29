var httpWrap = require('./httpService.js');

function RestAuth (http, opts, config) {
	this.config = config;
	RestAuth.super_.apply(this, [http, opts]);
};

require('util').inherits(RestAuth, httpWrap);

//get token
RestAuth.prototype.getToken = function(username, password, ip, remember, success, error) {
	this.options.path = '/tokens?writer=json';
	var data = {
		apiKey : this.config.AUTH_APIKEY,
		apiSecret : this.config.AUTH_SECRET,
		username: username,
		password: password,
		ipAddress: ip,
		rememberMe: remember
	};

	this.post(data, success, error);
};

//validate token
RestAuth.prototype.validateToken = function(token, ip, success, error) {
	if (!token) {
		error();
		return;
	}

	this.options.path = '/tokens/' + token + '?writer=json';
	var data = {
		ipAddress: ip
	};

	this.put(data, success, error);
};

//get owner passports
RestAuth.prototype.passports = function(owner_id, token, success, error) {
	this.options.path = '/applications/' + this.options.app 
						+ '/owner/' + owner_id + '/passports/?writer=json';
	var data = {
		token: token 
	};

	this.get(data, success, error);
};

//get owner students 
RestAuth.prototype.users = function(owner_id, token, success, error) {
	this.options.path = '/applications/' + this.options.app 
						+ '/owner/' + owner_id + '/users/?writer=json';
	var data = {
		token: token 
	};
	this.get(data, success, error);
};

RestAuth.prototype.editUser = function(owner_id, token, data, success, error) {
	this.options.path = '/applications/' + this.options.app 
						+ '/owner/' + owner_id + '/update-user/?writer=json';
						
	data.token = token;

	this.post(data, success, error);
};

RestAuth.prototype.addUser = function(owner_id, token, data, success, error) {
	this.options.path = '/applications/' + this.options.app 
						+ '/owner/' + owner_id + '/new-user/?writer=json';
						
	data.token = token;

	this.post(data, success, error);
};

// todo: write back end test for this
RestAuth.prototype.resetUserPassword = function(owner_id, token, user_id, success, error) {
	this.options.path = '/applications/' + this.options.app
	+ '/owner/' + owner_id + '/users/' + user_id + '/resetpassword?writer=json';

	var data = {
		token: token
	};

	this.get(data, success, error);
};


RestAuth.prototype.delUser = function(owner_id, token, username, success, error) {
    this.options.path = '/applications/' + this.options.app
                        + '/owner/' + owner_id + '/delete-user/?writer=json';

    var data = {
        token: token,
        username: username
    };

    this.post(data, success, error);
};
module.exports = RestAuth;
