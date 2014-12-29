//TODO add in tests in students controller for viewing a users student list with an inappropriate
//token
//TODO add in tests for adding/editing/removing from students list
var Service = require('./service'); require('util').inherits(c, Service);
var check = require("../validators/user");
var _ = require("underscore");

function c(init) {
	this.opts = {
		validateAll: true
	};
    // call parent constructor
    Service.call(this, init);
}

c.prototype.index = function index(c) {

	var error = function(error, b, d) {
        console.log(error.statusCode);
		//if 401 then redirect to login
		if (error.statusCode == 401) {
			c.redirect(c.path_to.login_page());
		} else if (error.statusCode == 404) {
			c.render({users: []});
		}
//		c.render(error.statusCode);
	};

    var gerUserIds = function(response) {
        var user_ids = [];
        var details = JSON.parse(response);
        _.each(details, function(ids) {
            user_ids.push(ids.id);
        });

        var getSectionScore = function(response){
            var section_ids = [];
            var section_Score = JSON.parse(response);
            _.each(details, function(user) {
                if (section_Score["user_" + user.id] != null){
                    user.score = section_Score["user_" + user.id].score;
                    user.section_id = section_Score["user_" + user.id].section_id;
                    section_ids.push(section_Score["user_" + user.id].section_id);
                }else {
                    user.score = null;
                    user.section_id = null;
                }

            });

            var success = function(response){
                var latest_section = [];
                var sections = JSON.parse(response);
                _.each(sections, function(section) {
                    latest_section[section.id] = section;
                });
                _.each(details, function(user){
                    if (user.section_id != null){
                        user.latest_section = "Section" + " " + latest_section[user.section_id].number + " " + "-" + " " + latest_section[user.section_id].name;
                    }else {
                        user.latest_section = null;
                    }
                });
	            // stringify, or we can not get this in views
                c.render({users: JSON.stringify(details)});
            };
            c.lessonApi().getSectionNames(section_ids.join(","), c.session.token.value, success, error);
        };

        c.studentData().getUsersScore(user_ids.join(","), c.session.token.value, getSectionScore, error);
    };

    c.restauth().users(c.session.token.user_id, c.session.token.value, gerUserIds, error);
};

c.prototype.getUsers = function getUsers(c) {

	var error = function(error) {
		if (error.statusCode == 404) {
			c.send({response: []});
		} else {
			c.send(error.statusCode);
		}
	};

	if (!c.req.is_ajax) {
		c.redirect(c.path_to.users_page());
		c.next();
		return;
	}

    c.restauth().users(c.session.token.user_id, c.session.token.value, handleSuccess(c), error);
};

c.prototype.editUser = function editUser(c) {
	//validate request

	var data = c.req.body,
		owner = c.session.token.user_id,
		token = c.session.token.value;

	if (!validate(c, data,  check.user)) {
		return;
	}

	//call restauth
	c.restauth().editUser(owner, token, data, handleSuccess(c), handleError(c));
};

c.prototype.addUser = function addUser(c) {
	var data = c.req.body,
		owner = c.session.token.user_id,
		token = c.session.token.value;

	// todo: turn this on when ready
	data.notify_user = true;
	if (!validate(c, data, check.new_user)) {
		return;
	}
	c.restauth().addUser(owner, token, data, handleSuccess(c), handleError(c));
};

// todo: write back end test for this
c.prototype.resetUserPassword = function resetUserPassword(c) {
	var data = c.req.body,
		user_id = data.user_id,
		token = c.session.token;

	c.restauth().resetUserPassword(token.user_id, token.value, user_id, handleSuccess(c), handleError(c));
};

c.prototype.delUser = function delUser(c) {
    var data = c.req.body,
        username = data.username;
    var token = c.session.token;

    c.restauth().delUser(token.user_id, token.value, username, handleSuccess(c), handleError(c));
};

c.prototype.getUserScores = function getUserScores(c) {
    var data = c.req.body;
    var user_id = data.user_id;

	var getSectionNames = function(response) {
		var sectionIds = [];
		var details = JSON.parse(response);
		_.each(details.scores, function(score) {
			sectionIds.push(score.section_id);
		});

		var success = function(response) {
			var sections = [];

			_.each(JSON.parse(response), function(section) { sections[section.id] = section; });
			_.each(details.scores, function(score) { score.section = sections[score.section_id]; });

			handleSuccess(c)(JSON.stringify(details));
		};

		c.lessonApi().getSectionNames(sectionIds.join(","), c.session.token.value, success, handleError(c));
	};

	c.studentData().getDetailsById(user_id, c.session.token.value, getSectionNames, handleError(c));
};

// todo: modify test for newly added user ids
c.prototype.getHistories = function getHistories(c){
    var data = c.req.body;
	var user_ids = data.user_ids;
    var length = data.length;
    var owner = c.session.token.user_id;
    var token = c.session.token.value;

    var getUserIds = function(response) {
        var user_ids = [];
        var details = JSON.parse(response);
        _.each(details, function (ids) {
            user_ids.push(ids.id);
        });

        var getHistory = function(response) {
            var usersHistory = JSON.parse(response);
            _.each(usersHistory, function (userHistory){
                userHistory.change_text = userHistory.displayName+" "+userHistory.change_text;
            });
            handleSuccess(c)(JSON.stringify(usersHistory));
        };

        c.studentData().getUsersHistory(user_ids, token, length, getHistory, handleError(c));
    };

	if (user_ids && user_ids.length > 0) {
		var getHistory = function(response) {
			var usersHistory = JSON.parse(response);
			_.each(usersHistory, function (userHistory){
				userHistory.change_text = userHistory.displayName+" "+userHistory.change_text;
			});
			handleSuccess(c)(JSON.stringify(usersHistory));
		};

		c.studentData().getUsersHistory(user_ids, token, length, getHistory, handleError(c));
	}
	else {
		c.restauth().users(owner, token, getUserIds, handleError(c));
	}
};

c.prototype.editUserSection = function editUserSection(c) {
    var token = c.session.token.value,
        data = c.req.body,
        user_id = data.user_id,
        section_id = data.section_id,
        chapter_id = data.chapter_id;

    c.studentData().updateUserProgress(user_id, section_id, chapter_id, token, handleSuccess(c), handleError(c));
};

c.prototype.getUserSection = function get_user_section(c) {
    var token = c.session.token.value;
    var data = c.req.body,
        user_id = data.user_id;

    c.studentData().getUserProgress(user_id, token, handleSuccess(c), handleError(c));
};

c.prototype.getUsersSectionScores = function getUsersSectionScores(c) {
	var token = c.session.token;
	var data = c.req.body;
	var section_id = data.section_id;

	var getUsersMsg = function (response) {
		var responseUsers = JSON.parse(response);
		var user_ids = [], fullname = [];
		_.each(responseUsers, function(user){
			user_ids.push(user.id);
			fullname.push(user.fullname);
		});

		c.studentData().getUsersSectionScore(user_ids, fullname, section_id, token.value, handleSuccess(c), handleError(c));
	};

	c.restauth().users(token.user_id, token.value, getUsersMsg, handleError(c));
};

// todo: adding unit testing
c.prototype.getUserAchievements = function getUserAchievements(c) {
	var token = c.session.token;
	var data = c.req.body;
	var user_id = data.user_id;

	c.studentData().getUserAchievements(user_id, token.value, handleSuccess(c), handleError(c));
};

function handleError(c) {
	return function(error) {
		console.log(error.statusCode);
		c.send(error.statusCode);
	};
}

function handleSuccess(c) {
	return function(response) {
		response ? c.send({response: response}) : c.send(200);
	};
}

function validate(c, data, validators) {
	var engine = new c.app.models.Validate(data, validators);
    if (engine.isValid.error) {
        c.res.statusCode = 400;
        c.send(engine.isValid.error);
        return false;
    } else {
        return true;
    }
}

module.exports = UsersController = c;
