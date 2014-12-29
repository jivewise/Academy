//TODO set up front end sass frameworks - 0.5 days
//TODO build out styles using sass frameworks - 1.5 day

//TODO add in models for creating new students on front end and backend, use validators.js
//TODO setup angular service tests - 1 day
//TODO start testing with protractor and phantom - 2 days
//TODO figure out how to compile assets

packager('academy.factory', function() {

	this.viewService = academy.app.factory('ViewService', [function () {

		var exports = {
			isUserListView: true,
			isAddUserView: false,
			isEditUserView: false,
			isUserDataView: false,
			isEditUserSectionView: false
		};

		// this is the default view
		exports.showUserList = function() {
			exports.isUserListView = true;
			exports.isAddUserView = false;
			exports.isEditUserView = false;
			exports.isUserDataView = false;
			exports.isEditUserSectionView = false;
			$('.content-wrapper').addClass('is-list-view');
		};

		exports.showAddUser = function() {
			exports.isUserListView = false;
			exports.isAddUserView = true;
			exports.isEditUserView = false;
			exports.isUserDataView = false;
			exports.isEditUserSectionView = false;
			$('.content-wrapper').removeClass('is-list-view')
		};

		exports.showEditUser = function() {
			exports.isUserListView = false;
			exports.isAddUserView = false;
			exports.isEditUserView = true;
			exports.isUserDataView = false;
			exports.isEditUserSectionView = false;
			$('.content-wrapper').removeClass('is-list-view')
		};

		exports.showUserData = function() {
			exports.isUserListView = false;
			exports.isAddUserView = false;
			exports.isEditUserView = false;
			exports.isUserDataView = true;
			exports.isEditUserSectionView = false;
			$('.content-wrapper').removeClass('is-list-view')
		};

		// this view has a fixed width, no need to hide other parts
		exports.showEditUserSection = function() {
			exports.isEditUserSectionView = true;
		};

		return exports;
	}]);
});