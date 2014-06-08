module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),
        qunit: {
            all: ["test/*.html"]
        },
        watch: {
            files: [
                "Gruntfile.js",
                "src/*.js",
                "test/*.js",
                "test/*.html"
            ],
            tasks: ["qunit"]
        }
    });

    grunt.registerTask("test", ["qunit"]);

    grunt.loadNpmTasks('grunt-contrib-qunit');
    grunt.loadNpmTasks('grunt-contrib-watch');
};
