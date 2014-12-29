var baseDir, httpService, http, httpServiceLib, config, callbacks, data, data_str;

baseDir = "../../../app/";
httpServiceLib = require(baseDir + "services/httpService.js"), 
http = require("http"), sinon = require('sinon'), chai = require('chai'), expect = chai.expect;



//TODO posts with data should have content length
//TODO continue with callback tests

describe("HttpService", function() {
  beforeEach(function() {
		config = {
			hostname: 'www.baidu.com',
			port: 80,
			path: '/',
		};

		badConfig = {
			hostname: 'asdf.baidu.com',
			port: 80,
			path: '/',
		};

		httpService = new httpServiceLib(http, config);
		badHttpService = new httpServiceLib(http, badConfig);

		data = {"test" : 1};
		data_str = JSON.stringify(data);
		callbacks = {success: sinon.spy(),
					error: sinon.spy()};	
	  });

  it("can post to url", function() {
	httpService.post(data, callbacks.success, callbacks.error);

	//expect options to have post
	expect(httpService.options.method).to.equal("POST");
  });

  it("can put to url", function() {
	httpService.put(data, callbacks.success, callbacks.error);

	//expect options to have put
	expect(httpService.options.method).to.equal("PUT");
  });

  it("can get to url", function() {
	httpService.get(data, callbacks.success, callbacks.error);

	//expect options to have post
	expect(httpService.options.method).to.equal("GET");
  });

  it("can delete to url", function() {
	httpService.del(data, callbacks.success, callbacks.error);

	//expect options to have delete
	expect(httpService.options.method).to.equal("DELETE");
  });

  it("can make success callback on data", function(done) {
	var success = function(response) {
        expect(response).to.be.ok;
		done();
	};
	httpService.get(data, success, callbacks.error);
  });

  it("can make error callback on error", function(done) {
	//expect error to have been called
	var error = function() {
		done();
	};

	badHttpService.get(data, callbacks.success, error);
  });

  it("has content length when posting data to url", function() {
	httpService.post(data, callbacks.success, callbacks.error);
	expect(httpService.options.headers['Content-Length'].toString()).to.equal(Buffer.byteLength(data_str).toString());
  });

  it("has a proper hostname, without http in it", function() {
	httpService.get(data, callbacks.success, callbacks.error);

	expect(httpService.options.hostname).to.not.equal("");
  });

  it("can add token header when data.token is there", function() {
	data.token = "hey there";
	httpService.post(data, callbacks.success, callbacks.error);

	expect(httpService.options.headers["Authorization"]).to.equal("OAuth hey there");
  });
});
