packager('academy.factory', function() {

	this.userDataService = academy.app.factory('UserDataService', ['$http', '$q', function ($http, $q) {

		var exports = {
			user: null,
			scoreData: {
				scores: [],
				averages: [],
				labels: [],
				data: []
			},
			section: null,
			achievements: []
		};

		exports.setUser = function(user) {
			exports.cleanData();
			exports.user = user;
		};

		exports.showUserData = function(user) {
			exports.setUser(user);
			exports.getUserScores();
			exports.getUserAchievements();
			exports.getUserSection();
		};

		exports.getUserScores = function() {

			var success = function(resp) {
				if (resp.response) {
					return exports.putUserScores(JSON.parse(resp.response));
				}
			};

			var data = {"user_id": exports.user.id};

			return $http.post(academy.routes.get_user_scores, data).success(success);
		};

		exports.putUserScores = function(data) {
			data.scores = _.sortBy(data.scores, function(score) {
				return new Date(score.date_modified);
			});

			var scores = _.each(data.scores, function(score) {
				score.score = parseFloat(score.score, 10);
				//go through each score and set average
				var temAvg = _.find(data.averages, function(average) {
					return average.section_id === score.section_id
				});

				// some may not contain average data
				if (temAvg && temAvg.average) {
					score.average = temAvg.average;
				} else {
					// this does not break the iterator
					return;
				}

				// this causes average property undefined error soemtimes

//				score.average = _.find(data.averages, function(average) {
//					return average.section_id === score.section_id
//				}).average;

				//if average is null, then set the default to 90
				score.average = score.average == null ? 90 : parseFloat(score.average, 10);

				// shorten section display name
				var name = score.section.number + '. ' + score.section.name;
				name = name.length > 15 ? name.substr(0, 12) + "..." : name;

				var date = moment(score.date_modified, 'YYYY-MM-DD h:mm:ss').format('MM/DD');

				exports.scoreData.labels.push(date);
				exports.scoreData.scores.push(score.score);
				exports.scoreData.averages.push(score.average);
				exports.scoreData.data.push(score);
			});

			return exports.scoreData.data;
		};

		exports.cleanData = function() {
			exports.scoreData.scores = [];
			exports.scoreData.averages = [];
			exports.scoreData.labels = [];
			exports.scoreData.data = [];
			exports.section = null;
			exports.achievements = [];
		};

		exports.putUserAchievements = function(list) {
			_.each(list, function(item) {
				exports.achievements.push(item);
			});
			return exports.achievements;
		};

		exports.getUserAchievements = function() {

			exports.achievements.length = 0;

			var success = function(resp) {
				return exports.putUserAchievements(JSON.parse(resp.response));
			};

			var data = {
				user_id: exports.user.id
			};

			return $http.post(academy.routes.get_user_achievements, data).success(success);
		};

		// get user section data, edit this later
		exports.getUserSection = function() {

			// clear section first
			exports.section = null;

			var success = function(resp) {
				if (resp.response) {
					return exports.putUserSection(JSON.parse(resp.response));
				}
			};

			var data = {user_id: exports.user.id};

			return $http.post(academy.routes.get_user_section, data).success(success);
		};

		exports.putUserSection = function(data) {
			return exports.section = data;
		};

		// edit user section; this is to edit user progress in whyyu-site
		exports.editUserSection = function(chapter, section, user) {

			// when succeeds, update user section
			// since first time get user section data has different data structure
			// just reassign their values
			var success = function() {
				exports.section = section;
				exports.section.section_name = section.name;
				exports.section.section_number = section.number;
				exports.section.section_image = section.image;
			};

			var data = {
				"user_id": user.id,
				"chapter_id": chapter.id,
				"section_id": section.id
			};

			return $http.post(academy.routes.edit_user_section, data).success(success);
		};

		return exports;
	}]);

});
