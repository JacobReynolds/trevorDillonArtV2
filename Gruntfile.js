module.exports = function (grunt) {
    grunt.initConfig({
        postcss: {
            options: {
                map: false,
                processors: [
                    require('autoprefixer')({
                        browsers: ['last 2 version']
                    })
                ]
            },
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

    grunt.loadNpmTasks('grunt-postcss');
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.registerTask('default', ['watch', 'postcss']);
};
