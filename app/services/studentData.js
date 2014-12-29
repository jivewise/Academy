var httpWrap = require('./httpService.js');

function StudentData (http, opts) {
	StudentData.super_.apply(this, [http, opts]);
};

require('util').inherits(StudentData, httpWrap);

StudentData.prototype.getDetailsById = function(user_id, token, success, error) {
	this.options.path = "/api/users/details";
	var data = {
		users: user_id,
		token: token
	};

	this.post(data, success, error);
};

StudentData.prototype.getUsersScore = function(user_ids, token, success, error) {
    this.options.path = "/api/users/summaries";
    var data = {
        users: user_ids,
        token: token
    };

    this.post(data, success, error);
};

StudentData.prototype.getUsersHistory = function(user_ids, token, length, success, error) {
    this.options.path = "/userHistory/getRecentActivities/"+token;
    var data = {
        user_ids: user_ids,
        length: length
    };

    this.post(data, success, error);
};

StudentData.prototype.updateUserProgress = function(user_id, section_id, chapter_id, token, success, error) {
    this.options.path = "/api/users/setCurrentSection";
    var data = {
        user_id: user_id,
        section_id: section_id,
        chapter_id: chapter_id,
        token: token
    };

    this.post(data, success, error);
};

StudentData.prototype.getUserProgress = function(user_id, token, success, error) {
    this.options.path = "/api/users/getCurrentSection";
    var data = {
        user_id: user_id,
        token: token
    };

    this.post(data, success, error);
};

StudentData.prototype.getUsersSectionScore = function (user_ids, fullname, section_id, token, success, error) {
    this.options.path = "/usersSection/scores";
    var data = {
        user_ids: user_ids,
        fullname: fullname,
        section_id: section_id,
        token: token
    };

    this.post(data, success, error);
};

// todo: adding unit testing
StudentData.prototype.getUserAchievements = function (user_id, token, success, error) {
	this.options.path = "/api/users/getUserAchievements";
	var data = {
		user_id: user_id,
		token: token
	};

	this.post(data, success, error);
};

module.exports = StudentData;
