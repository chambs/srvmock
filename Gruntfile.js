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
				sourceMap: 'lib/srvmock.map'
			},
			build: {
				src: 'src/srvmock-<%=pkg.version%>.js',
				dest: 'lib/srvmock.min.js'
			}
		},

		watch: {
			scripts: {
				files: ['src/*'],
				tasks: ['concat', 'uglify']
			}
		}

	});

	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-concat');

	grunt.registerTask('default', ['concat', 'uglify']);

};