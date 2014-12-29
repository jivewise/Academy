packager('academy.directives', function() {
	academy.app.directive("academyImageDirective", [function() {
		return {
			scope : {
				imageSrc : "@",
				height: "@",
				width: "@"
			},
			templateUrl: "academy-image-tpl",
			link: function(scope, element, attrs) {

				scope.imageRoot = "http://cdn.whyyu.com/images";
				scope.init = function() {
					scope.image = scope.imageRoot + (scope.imageSrc[0] != "/" ? "/" : "") + scope.imageSrc;
				};

				scope.$watch("imageSrc", function() {
					// simple check on whether it is an image url
					// or it will try to load an non-existent image
					if (!angular.isString(scope.imageSrc) || !/jpg|jpeg|gif|png$/.test(scope.imageSrc)) { return }
					scope.init();
				}, true);
			}
		};
	}]);
});
