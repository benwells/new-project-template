module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    connect: {
      serve: {
        options: {
          port: 8000,
          hostname: '*'
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
