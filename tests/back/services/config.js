
var ServerLode = function(){
    var http = require('http'),
        baseDir = "../../../app/",
        restauthLib = require(baseDir + "services/restauth.js"),
        studentDataLib = require(baseDir + "services/studentData.js"),
        lessonApiLib = require(baseDir + "services/lessonApi"),
        config = {
            restauth: {
                url : {
                    hostname: 'auth.staging.whyyu.com',
                    port: 80,
                    path: '',
                    app: 'whyyu_create'
                },
                keys : {
                    AUTH_APIKEY : 'e9220df5098a43a6fad95d6ee980a2448baabab1',
                    AUTH_SECRET : '691bd1ac7f7f30420153788b2d1ecfd7dc29f3bd'
                }
            },
            studentData : {
                url : {
                    hostname: 'learn.staging.whyyu.com',
                    port: 80,
                    path: ''
                }
            },
            lessonApi : {
                url : {
                    hostname: 'api.staging.whyyu.com',
                    port: 80,
                    path: ''
                }
            }
        };

    this.config = function(){
      return config;
    };

    this.restauth = function(){
        return new restauthLib(http, config.restauth.url, config.restauth.keys);
    };

    this.studentData = function(){
        return new studentDataLib(http, config.studentData.url);
    };

    this.lessonApi = function(){
        return new lessonApiLib(http, config.lessonApi.url);
    };


};

module.exports = ServerLode;