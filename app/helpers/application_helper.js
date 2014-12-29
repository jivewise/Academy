var jade = require("jade"), Path = require("path");

module.exports = {
	loggedIn : function() {
		if (this.req.session.token) {return true;}
		return false;
	},
	routes : function () {
		var partial = Path.join(this.app.get('views'), "/layouts/routes.jade");
		var locals = this.prepareViewContext();

		var html = jade.renderFile(partial, locals);
		return html;
	},
	partial : function (file, locals) {
		var partial = Path.join(this.app.get('views'), file + ".jade");
		var viewLocals = this.prepareViewContext();

		viewLocals.variables = locals;

		return jade.renderFile(partial, viewLocals);
	},
	getStylesheet: function(file) {
		var file_path = Path.join(this.app.get('cssDirectory'), file + ".css");

		return '<link type="text/css" rel="stylesheet" media="all" href="'
					+ file_path + '">';
	},
	validate : function(data, validator) {
		var validate_obj = require(this.app.get('validators') + validator);
		var engine = require("validator-ext");

		var validator = new engine.createValidator(data, validate_obj);

		return validator.execute();
	}
}
