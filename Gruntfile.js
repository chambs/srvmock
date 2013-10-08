module.exports = function(grunt) {

	grunt.initConfig({

		pkg: grunt.file.readJSON('package.json'),

		concat: {
			options: {
				separator: ';'
			},

			dist: {
				src: ['src/zon.js', 'src/srvmock.js'],
				dest: 'src/srvmock-<%=pkg.version%>.js'
			}
		},

		uglify: {
			options: {
				sourceMap: '../srvmock.map'
			},
			build: {
				//src: 'src/srvmock-<%=pkg.version%>.js',
				src: ['src/zon.js', 'src/srvmock.js'],
				dest: 'lib/srvmock.min.js'
			}
		},

		watch: {
			scripts: {
				files: ['src/*'],
				//tasks: ['concat', 'uglify']
				tasks: ['uglify']
			}
		}

	});

	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-concat');

	grunt.registerTask('default', ['concat', 'uglify']);

};