require('should');
var _und = require('underscore');

global.getApp = function(done) {
    var app = require('compound').createServer()

    app.renderedViews = [];
	app.renderedData = [];
    app.flashedMessages = {};

    // Monkeypatch app#render so that it exposes the rendered view files
    app._render = app.render;
    app.render = function (viewName, opts, fn) {
        app.renderedViews.push(viewName);
		app.renderedData[viewName] = opts;
		
		if (opts.request) {
			// Deep-copy flash messages
			var flashes = opts.request.session.flash;
			for(var type in flashes) {
				app.flashedMessages[type] = [];
				for(var i in flashes[type]) {
					app.flashedMessages[type].push(flashes[type][i]);
				}
			}
		}

        return app._render.apply(this, arguments);
    }

    // Check whether a view has been rendered
    app.didRender = function (viewRegex) {
        viewRegex = changeViewRegex(viewRegex);
        var didRender = false;
        app.renderedViews.forEach(function (renderedView) {
            if(renderedView.match(viewRegex)) {
                didRender = true;
            }
        });
        return didRender;
    }

	//check if data is rendered with this
	app.didRenderWithData = function(viewRegex, data) {
        viewRegex = changeViewRegex(viewRegex);
        var didRender = false;
        app.renderedViews.forEach(function (renderedView) {
            if(renderedView.match(viewRegex) && app.renderedData[renderedView] == data) {
                didRender = true;
            }
        });
        return didRender;
	}

	//return data that's rendered with a view
	app.getRenderData = function(viewRegex) {
        viewRegex = changeViewRegex(viewRegex);
		var data = null;
        app.renderedViews.forEach(function (renderedView) {
            if(renderedView.match(viewRegex)) {
        		data = app.renderedData[renderedView];
            }
        });
		return data;
	}

    // Check whether a flash has been called
    app.didFlash = function (type) {
        return !!(app.flashedMessages[type]);
    }

	//helper function for logging into academy
	app.login = function(request, data, done) {
		var agent = require("superagent").agent();
		request.post('/login/post').send(data).end(function (err, res) {
			if (err) {
				throw err;
			}
			agent.saveCookies(res);
			done(agent);
		});
	}

	//helper function for retrieving cookies from request
	app.requestCookies = function(req) {
		var cookies = [];
		_und.each(req.cookies.split(";"), function(cookie) {
			var key = cookie.split("=")[0];
			var value = unescape(cookie.split("=")[1]);
		
			try {
				cookies[key] = JSON.parse(value);
			} catch (e) {
				cookies[key] = value;
			}
		});
		
		return cookies;
	}

	app.replaceServices = function() {
		app._restauth = app.restauth();
		app._lessonApi = app.lessonApi();
		app._studentData = app.studentData();

		app.restauth = function() { return app._restauth; };
		app.lessonApi = function() { return app._lessonApi; };
		app.studentData = function() { return app._studentData; };
	};

    app.compound.on('ready', function() {
		app.replaceServices();
	});
    return app;

    function changeViewRegex(viewRegex){
        if (process.platform === 'win32'){
            viewRegex = viewRegex.toString().replace(/\\\//g,"\\\\").replace(/\//g ,"");
            var viewRegexStr = viewRegex.substr(0, viewRegex.lastIndexOf("i"));
            viewRegex = new RegExp(viewRegexStr, "i");
        }
        return viewRegex;
    }
};
