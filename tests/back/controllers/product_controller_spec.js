var app, compound, goodAgent, goodToken, restauth, lessonApi
    , request = require('supertest')
    , sinon   = require('sinon')
    , should = require('chai');

if(typeof(expect) === 'undefined'){ var expect = should.expect; }

describe('ProductsController', function() {
    beforeEach(function(done) {
        console.log("********************");
        console.log(this.currentTest.title);

        app = getApp();
        compound = app.compound;
        compound.on('ready', function() {
            restauth = app.restauth();
            lessonApi = app.lessonApi();
        });

        goodUd = {
            user: 'jwang',
            pass: 'newtest'
        };

        app.login(request(app), goodUd, function(agent) {
            goodAgent = agent;

            var req = request(app).get("/students");
            goodAgent.attachCookies(req);
            goodToken = app.requestCookies(req)['token'];

            done();
        });

    });


    //render products/index.jade, get all validate products
    it('renders "index" template on GET /lessons', function (done) {
        var req = request(app).get("/lessons");
        goodAgent.attachCookies(req);

        req.end(function (err, res) {
            var options = app.getRenderData( /products\/index\.jade$/i);

            expect(res.res.statusCode).equals(200);
            expect(app.didRender( /products\/index\.jade$/i)).equals(true);
            expect(options.products).to.be.ok;

            done();
        });
    });

    //it can get all products use ajax
    it("can get all products via ajax on GET /products", function(done){
        raTokenSpy = sinon.spy(lessonApi, "getProducts");

        request(app).get("/products").set({
            'authtoken': JSON.stringify(goodToken),
            'accept': 'application/json'
        }).end(function (err, obj) {
            expect(obj.res.body).to.be.ok;
            expect(obj.res.body.response).to.be.ok;

            //console.log(JSON.parse(obj.res.body.response));

            expect(lessonApi.getProducts.called).equals(true);
            expect(raTokenSpy.calledWith(goodToken.value)).equals(true);
            done();
        });
    });


    //can get all chapters of product
    it('can get all chapters of product on POST/products/product/chapters', function(done) {
        var data = {
            product_id: 36
        };
        raTokenSpy = sinon.spy(lessonApi, "getProductChapters");

        request(app).post("/products/product/chapters").set({
            'authtoken': JSON.stringify(goodToken),
            'accept': 'application/json'
        }).send(data).end(function (err, obj) {

            expect(obj.res.body).to.be.ok;
            expect(obj.res.body.response).to.be.ok;
            expect(JSON.parse(obj.res.body.response)).to.be.ok;

            expectValidProductChapter(JSON.parse(obj.res.body.response)[0]);

            expect(lessonApi.getProductChapters.called).equals(true);
            done();
        });
    });

    //can get all sections of product's chapter
    it('can get all sections of product chapter on POST/products/product/chapters/chapter/sections', function(done) {
        var data = {
            product_id: 38,
            chapter_id: 92
        };
        raTokenSpy = sinon.spy(lessonApi, "getProductChapterSections");

        request(app).post("/products/product/chapters/chapter/sections").set({
            'authtoken': JSON.stringify(goodToken),
            'accept': 'application/json'
        }).send(data).end(function (err, obj) {

            expect(obj.res.body).to.be.ok;
            expect(obj.res.body.response).to.be.ok;

            //console.log(JSON.parse(obj.res.body.response));
            expect(lessonApi.getProductChapterSections.called).equals(true);
            done();
        });
    });

    //can get a section of product's chapter
    it('can get a section of chapter on POST/products/product/chapters/chapter/sections/section', function(done) {
        var data = {
            product_id: 38,
            chapter_id: 92,
            section_id: 995
        };
        raTokenSpy = sinon.spy(lessonApi, "getProductChapterSection");

        request(app).post("/products/product/chapters/chapter/sections/section").set({
            'authtoken': JSON.stringify(goodToken),
            'accept': 'application/json'
        }).send(data).end(function (err, obj) {

            expect(obj.res.body).to.be.ok;
            expect(obj.res.body.response).to.be.ok;

            //console.log(JSON.parse(obj.res.body.response));
            expect(lessonApi.getProductChapterSection.called).equals(true);
            done();
        });
    });


});

function expectValidProductChapter(chapter) {
    expect(chapter).to.have.property('id');
    expect(chapter).to.have.property('name');
    expect(chapter).to.have.property('number');
    expect(chapter).to.have.property('alternate_name');
    expect(chapter).to.have.property('level');
    expect(chapter).to.have.property('product_chapter_name');
    expect(chapter).to.have.property('product_chapter_order');
}
