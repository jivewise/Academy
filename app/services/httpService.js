var _und = require("underscore"), errorLogger = require('./errorLogger');

var logger = new errorLogger();

var httpService = function(http, options) {
	this.options = options;
	this.http = http;

	this.get = function(data, callback, error) {
		this.options.method = 'GET';
		this.request(data, callback, error);
	};
	this.post = function(data, callback, error) {
		this.options.method = 'POST';
		this.request(data, callback, error);
	};
	this.put = function(data, callback, error) {
		this.options.method = 'PUT';
		this.request(data, callback, error);
	};
	this.del = function(data, callback, error) {
		this.options.method = "DELETE";
		this.request(data, callback, error);
	};
	this.request = function(data, callback, error) {
		this.callback = callback;
		this.error = error;

		if (data) {
			var token = data.token != null ? data.token : '',
			data = JSON.stringify(data);

			this.options.headers = {
				'Content-Length' : Buffer.byteLength(data),
				'Content-Type' : 'application/json',
				'Authorization' : "OAuth " + token
			};
		}

		var self = this;
		var success = _und.bind(this.success, this);
		this.req = new this.http.request(this.options, function(res) {
			var result = '';

			res.on('data', function(chunk) {
				result += chunk;
			});
			res.on('end', function() {
				if (res.statusCode >=400) {

					// log error
					logger.logHttpResponseError(res, result, data);

					error(res, result);
				} else {
					success(result);
				}
			});
		});

		this.req.on('error', error);
		if (data) { this.req.write(data, 'utf8'); }

		try {
			this.req.end();
		} catch (e) {
			console.log(e);

			logger.logHttpRequestError(this.req, data);

			error();
		}
	};

	this.success = function(response) {
		this.callback(response);
	};
};

module.exports = httpService;
