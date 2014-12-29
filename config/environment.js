module.exports = function (compound) {

    var express = require('express');
    var app = compound.app;
	var Path = require('path');
	var methodOverride = require('method-override');

	app.set('version', require(Path.join(app.root, 'package.json')).version);
	app.set('validators', Path.join(app.root, '/app/validators'));
	app.use(express.static(app.root + '/public', { maxAge: 86400000 }));
	app.set('jsDirectory', '/javascripts/');
	app.set('cssDirectory', '/stylesheets/');
	app.set('view engine', 'jade');
	//app.set('cssEngine', 'scss');

	compound.loadConfigs(__dirname);
	app.use(express.urlencoded());
	app.use(express.json());
	app.use(express.cookieParser('secret'));
	app.use(express.session({secret: 'secret'}));
	app.use(methodOverride());
	app.use(app.router);

};
