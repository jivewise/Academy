packager('academy.directives', function() {
	academy.app.directive("editUserSectionDirective", [function() {
		return {
			//scope: {},
			controller: "MiddleController",
			controllerAs: "middle",
			templateUrl: "edit-user-section-tpl",
			link: function(scope, element, attrs) {

				var middle = scope.middle;

				scope.isSectionListView = false;

				scope.closeModal = function() {
					$('html,body').removeClass('modal-lock');
					$('.modal-overlay').hide(0);
					middle.viewService.isEditUserSectionView = false;
				};

				scope.showChapterList = function() {
					scope.isSectionListView = false;
				};

				scope.showSectionList = function(chapter) {

					var success = function() {
						scope.isChapterListView = false;
						scope.isSectionListView = true;
					};

					middle.productService.chapter = chapter;
					var promise = middle.productService.getSections(chapter);
					promise.success(success);
				};

				scope.editUserSection = function(section) {

					middle.productService.section = section;

					var success = function() {
						scope.closeModal();
					};

					var chapter = middle.productService.chapter;
					var user = middle.userService.user;

					var promise = middle.userDataService.editUserSection(chapter, section, user);
					promise.success(success);

				};

				scope.$watch(function() {
					return middle.viewService.isEditUserSectionView;
				}, function() {
					if (middle.viewService.isEditUserSectionView) {
						$('html,body').addClass('modal-lock');
						$('.modal-overlay').show(0);
					}

				});
			}
		};
	}]);
});