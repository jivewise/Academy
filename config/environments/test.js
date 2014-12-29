var express = require('express');

var config = {
	fixtureDir : '/config/fixtures/',
	restauth: {
		url : {
			hostname: 'auth.staging.whyyu.com',
			port: 80,
			path: ''
		},
		keys : {
			AUTH_APIKEY : 'e9220df5098a43a6fad95d6ee980a2448baabab1',
			AUTH_SECRET : '691bd1ac7f7f30420153788b2d1ecfd7dc29f3bd' 
		}
	}
};


module.exports = function (compound) {
    var app = compound.app, 
		serviceLoader = require(app.root + "/config/service-loader"), 
		fixtureLoader = require(app.root + "/config/fixture-loader");
	
    app.configure('test', function(){
		serviceLoader.load(app, config);
		fixtureLoader.load(Path.join(app.root, config.fixtureDir));

        app.use(express.errorHandler({dumpExceptions: true, showStack: true}));
        app.use(express.session({secret: 'secret'}));
        app.enable('quiet');
        app.enable('view cache');
        app.enable('model cache');
        app.enable('eval cache');
    });

};
