academy = academy ? academy : {};

beforeEach(function(done) {
	app = ngMidwayTester('schoolApp', ['ngCookies']);

	loginService = app.inject('LoginService');
	http = app.inject('$http');
	_win = app.inject('$window');
	loginService.init('jwang', 'newtest').then(function(response) {
		var tokenStr = academy.authtoken = response.data.response;
		 _win.authtoken = academy.authtoken;
	//	setCookie("token", tokenStr);
		done();
	});
});

function setCookie( name, value, expires, path, domain, secure )
{
	// set time, it's in milliseconds
	var today = new Date();
	today.setTime( today.getTime() );

	if ( expires ) {
		expires = expires * 1000 * 60 * 60 * 24;
	}
	var expires_date = new Date( today.getTime() + (expires) );

	document.cookie = name + "=" +escape( value ) +
		( ( expires ) ? ";expires=" + expires_date.toGMTString() : "" ) +
		( ( path ) ? ";path=" + path : "" ) +
		( ( domain ) ? ";domain=" + domain : "" ) +
		( ( secure ) ? ";secure" : "" );
}


afterEach(function() {
	//academy.logout();
});

academy.login = function(loginService) {
	loginService.init('jwang', 'newtest');
};
