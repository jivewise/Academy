// load parent controller
var Essentials = require('kontroller').BaseController; require('util').inherits(ServiceController, Essentials);

function ServiceController(init) {
    // call parent constructor
    Essentials.call(this, init);

	init.before(function setService(c) {
		c.restauth = c.app.restauth;
		c.studentData = c.app.studentData;
		c.lessonApi = c.app.lessonApi;

		c.req.is_ajax = c.req.headers.accept && c.req.headers.accept.indexOf('application/json') !== -1;
		c.next();
    });

	init.before(function validateController(c) {
		validate(c);
	}, {only : 'service'});

	init.before(function allowCrossOrigin(c) {
		if (c.app.get('env') === 'development') {
			c.res.header("Access-Control-Allow-Origin", "*");
			c.res.header("Access-Control-Allow-Headers", "Content-Type, authorization, authtoken");
		}
		c.next();
	});

	init.after(function mapAssets(c) {

		//assetMapper(c);
	});

	if (this.opts && this.opts.validateAll) {
		init.before(function validateAllControllers(c) {
			validate(c);
		});
	}
}

function validate(c) {
	var ip = c.req.ip, 
		token_str = c.req.cookies.token || c.req.headers.authtoken || c.req.body.authorization;

	console.log(c.req.body);

	var success = function() {
		c.next();
	};

	var error = function() {
		//if req header is ajax
		c.req.session.token = null;
		if (c.req.is_ajax) {
			c.send(401);
		} else {
			c.redirect(c.path_to.login_page());
		}
	};

	try {
		var token = c.req.session.token = JSON.parse(token_str);
		c.restauth().validateToken(token.value, ip, success, error);
	} catch (e) {
		error();
	}
};

ServiceController.prototype.service = function service(c) {
	c.send(200);
};

module.exports = ServiceController;
