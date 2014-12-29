var http, lessonApi, restauth, studentData;
var config = require('./config');
http = require("http"), sinon = require('sinon'), chai = require('chai'), expect = chai.expect;

var serverLode = new config;
restauth = serverLode.restauth();
studentData = serverLode.studentData();
lessonApi = serverLode.lessonApi();

describe("LessonApi", function() {
	var getTokenData, requestSpy, testToken;
	beforeEach(function(done) {
		getTokenData = {
			username: "jwang",
			password: "newtest",
			ip: "127.0.0.1",
			remember: "false"
		};
		requestSpy = sinon.spy(restauth, "request");

		var data = getTokenData;
		var success = function(token) {
			testToken = JSON.parse(token);
			done();
		};

		var error = function() {
			expect("ERROR GETTING TOKEN").equals("");
		};

		restauth.getToken(data.username, data.password, data.ip, data.remember, success, error);
	});

    afterEach(function() {
        restauth.request.restore();
    });


	it("can get section names", function(done) {

        var getSectionNames = function(response){
            var student = JSON.parse(response);
            var length = student.scores.length,
                sectionIds = [];

            for (var i=0; i<length; i++){
                sectionIds.push(student.scores[i].section_id);
            }

            var success = function(response){
                var sectionNames = JSON.parse(response);
                expectValidSection(sectionNames[0]);
                done();
            };

            var errorLessonApi = function(){
              expect("ERROR GET SECTION NAMES").equals('');
            };

            lessonApi.getSectionNames(sectionIds.join(","), token.value, success, errorLessonApi);

            expect(lessonApi.options.method).to.equal("POST");
            expect(lessonApi.options.path).to.equal('/sectionNames?writer=json');
        };


        var errorStudetData = function(){
            expect('ERROR GET SECTION NAMES').equals('');
        };

        var token = testToken;
        studentData.getDetailsById(token.user_id, token.value, getSectionNames, errorStudetData);


	});

    it("can get all available products", function (done) {

        var token = testToken;
        var success = function (response) {
            expectValidProduct(JSON.parse(response)[0]);
            done();
        };
        var error = function() {
            expect("ERROR GET ALL AVAILABLE PRODUCTS").equals('');
            done();
        };
        lessonApi.getProducts(token.value, success, error);


        expect(lessonApi.options.method).to.equal("GET");
        expect(lessonApi.options.path).to.equal( '/products/available?writer=json');
    });

    it("can get all chapters of product", function (done) {

        var token = testToken;
        var success = function (response) {
            //console.log(JSON.parse(response));
            done();
        };
        var error = function() {
            expect("ERROR GET CHAPTERS OF PRODUCT").equals('');
            done();
        };
        lessonApi.getProductChapters(token.value, 36, success, error);


        expect(lessonApi.options.method).to.equal("GET");
        expect(lessonApi.options.path).to.equal( '/products/36/chapters?writer=json');
    });

    it("can get all sections of product's chapter", function (done) {

        var token = testToken;
        var success = function (response) {
            //console.log(JSON.parse(response));
            done();
        };
        var error = function() {
            expect("ERROR GET ALL SECTIONS OF PRODUCT'S CHAPTER").equals('');
            done();
        };
        lessonApi.getProductChapterSections(token.value, 38, 92, success, error);


        expect(lessonApi.options.method).to.equal("GET");
        expect(lessonApi.options.path).to.equal( '/products/38/chapters/92?writer=json');
    });

    it("can get a section of product's chapter", function (done) {

        var token = testToken;
        var success = function (response) {
            //console.log(JSON.parse(response));
            done();
        };
        var error = function() {
            expect("ERROR GET A SECTION OF PRODUCT'S CHAPTER").equals('');
            done();
        };
        lessonApi.getProductChapterSection(token.value, 38, 92, 995, success, error);


        expect(lessonApi.options.method).to.equal("GET");
        expect(lessonApi.options.path).to.equal( '/products/38/chapters/92/sections/995?writer=json');
    });


});

function expectValidSection(section) {
	expect(section).to.have.property('id');
	expect(section).to.have.property('chapter_id');
	expect(section).to.have.property('number');
	expect(section).to.have.property('name');
    expect(section).to.have.property('image');
}

function expectValidProduct(product) {
    expect(product).to.have.property('id');
    expect(product).to.have.property('name_zh');
    expect(product).to.have.property('name_en');
    expect(product).to.have.property('image_url');
    expect(product).to.have.property('description');
    expect(product).to.have.property('number');
    expect(product).to.have.property('keyword');
    expect(product).to.have.property('chapters');
}

