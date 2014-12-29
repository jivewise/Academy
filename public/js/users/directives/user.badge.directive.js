packager('academy.directives', function() {
	academy.app.directive("studentBadge", [function() {
		return {
			scope: {
				student : '=',
			},
			templateUrl: "student-badge-tpl",
			transclude: true,
			link: function(scope, element, attrs) {
				scope.getStudentIconText = function(name) {

					var nameArr = name.trim().split(" "),
						isEnglish = true;

					_.each(nameArr, function(val) { 
						isEnglish |= escape(val) === val; 
					});

					if (name.length == 2) {
						return name;
					} else if (isEnglish && nameArr.length > 1) {
						nameArr = name.split(" ");
						return nameArr[0][0] + nameArr[nameArr.length -1][0];
					} else {
						return name[0];
					}
				};

				scope.$watch("student", function() {
					if (!scope.student) { return ; }
					var iconText = scope.getStudentIconText(scope.student.fullname);
					scope.firstLetter = iconText ? iconText[0] : '';
					scope.secondLetter = iconText && iconText.length >= 2 ? iconText[1] : '';
				});
			}
		};
	}]);
});
