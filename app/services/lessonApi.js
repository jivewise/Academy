var httpWrap = require('./httpService.js');

function LessonApi (http, opts, config) {
	this.config = config;
	LessonApi.super_.apply(this, [http, opts]);
};

require('util').inherits(LessonApi, httpWrap);

//get token
LessonApi.prototype.getSectionNames = function(sections, token, success, error) {
	this.options.path = '/sectionNames?writer=json';
	var data = {
		sections: sections,
		token: token
	};

	this.post(data, success, error);
};
module.exports = LessonApi;
