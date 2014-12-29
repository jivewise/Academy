var Service = require('./service'); require('util').inherits(c, Service);

function c(init) {
	this.opts = {
		validateAll: true
	};
    // call parent constructor
    Service.call(this, init);
}

c.prototype.getPassports = function get_passport(c) {

	if (!c.req.is_ajax) {
		c.redirect(c.path_to.users_page());
	} else {
		//get all passports
		c.restauth().passports(c.session.token.user_id, c.session.token.value, handleSuccess(c), handleError(c));
	}
};

function handleError(c) {
    return function(error) {
        console.log(error.statusCode);
        c.send(error.statusCode);
    };
}

function handleSuccess(c) {
    return function(response) {
        response ? c.send({response: response}) : c.send(200);
    };
}

module.exports = PassportsController = c;
