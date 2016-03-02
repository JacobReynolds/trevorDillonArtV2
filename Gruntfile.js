module.exports = function (grunt) {
    grunt.initConfig({
        autoprefixer: {
                multiple_files: {
                expand: true,
                flatten: true,
                src: 'public/stylesheets/*.css', 
                dest: 'public/stylesheets/build/'
            }
        },
        watch: {
            styles: {
                files: ['public/stylesheets/*.css'],
                tasks: ['autoprefixer']
            }
        }
    });
    grunt.loadNpmTasks('grunt-autoprefixer');
    grunt.loadNpmTasks('grunt-contrib-watch');

grunt.registerTask('default', ['watch', 'autoprefixer']);
};
