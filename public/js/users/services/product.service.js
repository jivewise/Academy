packager('academy.factory', function() {

	var product_list = window.products || [];

	this.productService = academy.app.factory('ProductService', ["$http", "$q", function ($http, $q) {

		var exports = {
			products: product_list,
			product: null,
			chapters: [],
			chapter: null,
			sections: [],
			section: null
		};

		// todo: we only display one product on this page; no product list
		// this only returns one product
		//exports.getProducts = function() {
		//	var success = function(resp) {
		//		return exports.putProducts(JSON.parse(resp.response));
		//	};
		//
		//	return $http.get(academy.routes.get_products).success(success);
		//};
		//
		//exports.putProducts = function(list) {
		//	exports.products.length = 0;
		//	_.each(list, function(item) {
		//		exports.products.push(item);
		//	});
		//
		//	return product_list = window.products = exports.products;
		//};

		exports.getProduct = function() {
			var success = function(resp) {
				return exports.putProduct(JSON.parse(resp.response)[0]);
			};

			return $http.get(academy.routes.get_products).success(success);
		};

		exports.putProduct = function(product) {
			exports.product = product;
			// now get the chapters of this product
			exports.getChapters(exports.product);
		};

		exports.getChapters = function(product) {
			var success = function(resp) {
				return exports.putChapters(JSON.parse(resp.response));
			};

			//store current product
			if (exports.product != product) {
				exports.product = product;
			}

			var data = {"product_id": product.id};

			return $http.post(academy.routes.get_product_chapters, data).success(success);
		};

		exports.putChapters = function(list) {
			exports.chapters.length = 0;
			_.each(list, function(item) {
				exports.chapters.push(item);
			});
			return exports.chapters;
		};

		exports.getSections = function(chapter) {
			var success = function(resp) {
				return exports.putSections(JSON.parse(resp.response));
			};

			// store current chapter
			exports.chapter = chapter;

			var data = {"product_id": exports.product.id, "chapter_id": chapter.id};

			return $http.post(academy.routes.get_product_chapter_sections, data).success(success);
		};

		exports.putSections = function(list) {
			exports.sections.length = 0;
			_.each(list, function(item) {
				exports.sections.push(item);
			});

			return exports.sections;
		};

		exports.getSection = function(section) {
			exports.section = section;
		};

		// get pdf url; open that url in new window to download
		exports.downloadSection = function () {
			var success = function(resp) {
				// download the pdf now
				if (angular.isString(resp)) {
					window.open(resp, "Download " + exports.section.name)
				}
			};

			var data = {
				"chapter_id": exports.section.chapter_id,
				"section_id": exports.section.id
			};

			$http.post(academy.routes.download_section, data).success(success);
		};

		// get products once here
		if (!exports.product) {
			exports.getProduct();
		}

		return exports;
	}]);
});
