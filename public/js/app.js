packager('academy', function() {
	var schoolApp = angular.module('schoolApp', []);
	this.app = schoolApp;
});

// toggle nav menu on responsive
$(document).ready(function() {
	$('li.btn-mini-nav').on('click', function(e) {
		e.stopPropagation();
		if ($('div.mini-nav-wrapper').is(':visible')) {
			$(this).removeClass('active');
		} else {
			$(this).addClass('active');
		}
		$('div.mini-nav-wrapper').slideToggle(100);
	});

	// use underscore throttle
	var hideMiniNav = _.throttle(function() {
		$('div.mini-nav-wrapper').hide(0);
		$('li.btn-mini-nav').removeClass('active');
	}, 250);

	$(window).on('resize', hideMiniNav);
	$(document).on('click', hideMiniNav);
});