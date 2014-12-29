var bunyan = require("bunyan");

var log = bunyan.createLogger({
	name: "academy",
	streams: [
		{
			path: './log/service_error.log'
		}
	]
});

var logger = function() {

	this.logHttpRequestError = function(req, req_body) {
		log.error('error', {
			"req": {
				url: req.path,
				method: req.method,
				headers: req._headers,
				body: req_body
			}
		}, 'Http Service Request Error');
	};

	this.logHttpResponseError = function(res, res_body, req_body) {
		log.error({'error': {
			"req": {
				url: res.req.path,
				method: res.req.method,
				headers: res.req._headers,
				body: req_body
			},
			"res" : {
				headers: res.headers,
				body: res_body
			}
		}}, 'Http Service Response Error');
	};
};

module.exports = logger;
