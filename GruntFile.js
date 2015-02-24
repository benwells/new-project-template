module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    connect: {
      ssl: {
        options: {
          port: 8000,
          hostname: '*',
          protocol: 'https'
        }
      },
      serve: {
        options: {
          port: 8000,
          hostname: '*',
          protocol: 'http'
        }
      }
    },
    watch: {
      all: {
        files: '**/*',
        options: {
          livereload: true,
        },
      },
    },
  });

  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-connect');

  // Default task(s).
  grunt.registerTask('default', ['watch:all']);
  grunt.registerTask('serve', ['connect:serve', 'watch:all']);


};
