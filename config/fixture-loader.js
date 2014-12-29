var Path = require("path"), 
	nock = require("nock"), 
	Promise = require("bluebird"),
	_und = require("underscore"),

	nockOptions = {
		allowUnmocked: false
	};

var fs = Promise.promisifyAll(require("fs"));

var fixtureLoader = function() {

	this.load = function(fixtureDir) {
		if (false)
			nock.recorder.rec();

		fs.readdirAsync(fixtureDir).map(function(file) {
			var path = Path.join(fixtureDir, file);
			return Promise.props({
				name : file,
				path: path,
				stat: fs.statAsync(path)
			});
		}).map(_und.bind(this.loadHttpDirectory, this));
	};

	this.loadHttpDirectory = function(directory) {
		var host = this.getHostFromName(directory.name);
		var load = this.loadFixture;
		if (directory.stat.isDirectory() && directory.name.match(/^http/)) {
			fs.readdirAsync(directory.path).map(function(directory_file) {
				console.log("Loading fixture: " + directory.name + "/" + directory_file);
				load(host, Path.join(directory.path, directory_file));
			});
		}
	};

	this.getHostFromName = function(directory) {
		return directory.replace("_", "://") + ":80";
	};

	this.loadFixture = function(host, file) {
		var fixture = require(file), 
			method = fixture.method.toUpperCase(),
			mock = nock(host, nockOptions).get;

		if (method === "POST") {
			mock = nock(host, nockOptions).post;
		} else if (method === "PUT") {
			mock = nock(host, nockOptions).put;
		} else if (method === "DELETE") {
			mock = nock(host, nockOptions).delete;
		}
	
		var response = typeof(fixture.response) === "string" 
			? fixture.response : JSON.stringify(fixture.response);

		var data = typeof(fixture.data) === "string" 
			? fixture.data : JSON.stringify(fixture.data);

		mock(fixture.path, data).reply(fixture.code, response).persist();
	};
};

module.exports = new fixtureLoader;
