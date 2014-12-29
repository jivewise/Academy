var Service = require('./service'); require('util').inherits(c, Service);
//TODO add in logic for groups checking on login, if not superadmin, or academy_admin, don't allow
//login
//
//
function c(init) {
    // call parent constructor
    Service.call(this, init);
}


c.prototype.index = function login(c) {
	c.render({title : 'Login'});
};

c.prototype.post = function loginPost(c) {
	var success = function(token) {
		c.res.cookie('token', token);
		c.redirect(c.path_to.users_page());
	};

	var error = function(response, result) {
		c.redirect(c.path_to.login_page());
	};

	getToken(c, success, error);
};

c.prototype.ajax = function ajaxLogin(c) {
	var success = function(token) {
		c.send({response: token});
	};

	var error = function(response, result) {
		c.send(302);
	};

	getToken(c, success, error);
};

function getToken(c, success, error) {
	var user = c.req.body.user,
		pass = c.req.body.pass,
		ip = c.req.ip,
		remember = c.req.body.remember ? "true" : "false";

	c.restauth().getToken(user, pass, ip, remember, success, error);
}

module.exports = LoginController = c;
