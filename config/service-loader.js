var serviceLoader = function() {
	this.load = function(app, config) {
		var serviceDir = app.root + "/app/services/",
			http = require("http"),
			restauth = require(serviceDir + "restauth.js"),
			lessonApi = require(serviceDir + "lessonApi.js"),
			studentData = require(serviceDir + "studentData.js");

		app.restauth = function() {
			return new restauth(http, config.restauth.url, config.restauth.keys);
		};
		app.studentData = function() {
			return new studentData(http, config.studentData.url);
		};
		app.lessonApi = function() {
			return new lessonApi(http, config.lessonApi.url);
		};
	};
};

module.exports = new serviceLoader;
