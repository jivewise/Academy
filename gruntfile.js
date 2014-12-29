/*global module:false*/
module.exports = function(grunt) {
  // Project configuration.
  grunt.initConfig({
	pkg: grunt.file.readJSON('package.json'),
    jscs : {
		src: "app/**/*.js",
  		options : {
			"requireCurlyBraces": [
				"for",
				"while",
				"do",
				"try",
				"catch",
			],
  			maximumLineLength: 120,
			requireCapitalizedConstructors: true
		}
	},
    useminPrepare: {
		options : {
			root: 'public',
  			dest: 'public'
		},
		src: ['app/views/**/*.jade']
	},
	usemin : {
		html: ['app/views/**/*.jade']
	},
    watch: {
	  jasmine: {
		files: ['tests/front/**/*.js','<config:jasmine.options.helpers>','<config:jasmine.src>'],
		tasks: ['jasmine']
	  },

	  compass: {
	  	files: ['app/assets/stylesheets/**/*.scss'],
		tasks: ['compass:dev']
	  },

	  mocha: {
		files: ['tests/back/**/*.js','app/**/*.js'],
		tasks: ['mochaTest']
	  },

	  template : {
		files: ['app/views/**/templates.jade'],
		tasks: ['jade:compile', 'ngtemplates']
	  }
    },

	compass: {
		dev : {
			options : {
				sassDir: "app/assets/stylesheets/",
				cssDir: "public/stylesheets/",
				environment: "development",
				outputStyle: "expanded"
			}
		},
		dest : {
			options : {
				sassDir: "app/assets/stylesheets/",
				cssDir: "public/stylesheets/",
				environment: "production",
				outputStyle: "compressed"
			}
		}
	},
	mochaTest : {
	  test : {
		options : {
		  require : 'tests/mocha-init.js',
		  reporter : 'nyan',
		  colors: 'true'
		},
		src: 'tests/back/**/*.js'
	  }
	},
	jade : {
		compile : {
			files : {
				"tests/front/templates/template.html" : ["app/views/**/templates.jade"]
			}
		}
	},
	ngtemplates : {
	  app : {
	    src : 'tests/front/templates/*.html',
		dest : 'tests/front/templates/templates.js',
		options : {
		  module: 'schoolApp'
		}
	  }
	}
  });

  grunt.loadNpmTasks('grunt-contrib-compass');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-usemin');
  grunt.loadNpmTasks("grunt-jscs-checker");
  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-shell');
  grunt.loadNpmTasks('grunt-contrib-jade');
  grunt.loadNpmTasks('grunt-angular-templates');

  // Default task.
  grunt.registerTask('default', ['compass:dev']);
  grunt.registerTask('compile-template', ['jade:compile', 'ngtemplates']);
  grunt.registerTask('build', ['useminPrepare', 'concat', 'uglify', 'usemin']);
};
