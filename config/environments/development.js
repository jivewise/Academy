var express = require('express'), Path = require('path');

var config = {
	fixtureDir : '/config/fixtures/',
	restauth: {
		url : {
			hostname: 'auth.staging.whyyu.com',
			port: 80,
			path: '',
			app: 'whyyu_create'
		},
		keys : {
			AUTH_APIKEY : 'e9220df5098a43a6fad95d6ee980a2448baabab1',
			AUTH_SECRET : '691bd1ac7f7f30420153788b2d1ecfd7dc29f3bd'
		}
	},
	studentData : {
		url : {
			hostname: 'learn.staging.whyyu.com',
			port: 80,
			path: ''
		}
	},
	lessonApi : {
		url : {
			hostname: 'api.staging.whyyu.com',
			port: 80,
			path: ''
		}
	}
};

module.exports = function (compound) {
    var app = compound.app,
		serviceLoader = require(app.root + "/config/service-loader"),
		fixtureLoader = require(app.root + "/config/fixture-loader");

	if (app.get('env') === 'development') {
		serviceLoader.load(app, config);
		fixtureLoader.load(Path.join(app.root, config.fixtureDir));

        app.enable('log actions');
        app.enable('env info');
        app.enable('watch');
//        app.enable('force assets compilation');
        app.set('translationMissing', 'display');
        app.set('sectionDownloadUrl', config.sectionDownLodaUrl);
        app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
    }
};
