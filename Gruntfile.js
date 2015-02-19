/* global module */

module.exports = function(grunt) {
    grunt.initConfig({
        distFolder: "dist",
        pkg: grunt.file.readJSON("package.json"),

        clean: ["<%= distFolder %>"],

        compress: {
            main: {
                options: {
                    archive: "<%= distFolder %>/<%= pkg.name %>.zip"
                },
                files: [
                    { src: ["_locales/**", "src/**", "key.pem", "LICENSE", "README.md"] },
                    { src: ["manifest.json"], cwd: "<%= distFolder %>/", expand: true }
                ]
            }
        },

        copy: {
            main: {
                files: [
                    {expand: true, src: ["_locales/**", "src/**", "<%= distFolder %>/manifest.json"], dest: "<%= distFolder %>/unpacked"},
                    {expand: true, flatten: true, src: ["<%= distFolder %>/manifest.json"], dest: "<%= distFolder %>/unpacked"},
                ]
            }
        },

        jshint: {
            files: [
                "Gruntfile.js",
                "src/**/*.js",
                "!src/js/lib/*.js",
                "test/**/*.js",
                "!test/js/util/Squire-0.2.0.js",
            ],
            options: {
                bitwise: true,
                camelcase: true,
                curly: false,
                eqeqeq: true,
                es3: false,
                forin: true,
                freeze: true,
                immed: true,
                indent: 4,
                latedef: true,
                maxdepth: 3,
                //maxparams: 5,
                newcap: true,
                noempty: true,
                nonbsp: true,
                nonew: true,
                plusplus: true,
                quotmark: "double",
                strict: false,
                undef: true,
                unused: "vars",

                browser: true,
                globals: {
                    after: true,
                    afterEach: true,
                    assert: true,
                    before: true,
                    beforeEach: true,
                    console: true,
                    define: true,
                    describe: true,
                    it: true,
                    mocha: true,
                    require: true,
                    sinon: true
                }
            }
        },

        "js-test": {
            options: {
                pattern: "test/js/*.js",
                deps: [
                    "src/js/RequireConfig.js",
                    "src/js/lib/require-2.1.14.min.js",
                    "test/js/util/testBootstrapper.js"
                ],
                log: true,
                coverage: false,
                coverageReportDirectory: "<%= distFolder %>",
                identifier: "coverage",
                requirejs: true
            }
        },

        watch: {
            files: ["<%= jshint.files %>"],
            tasks: ["jshint", "js-test", "manifest", "copy"]
        }
    });

    grunt.loadNpmTasks("grunt-contrib-clean");
    grunt.loadNpmTasks("grunt-contrib-compress");
    grunt.loadNpmTasks("grunt-contrib-copy");
    grunt.loadNpmTasks("grunt-contrib-jshint");
    grunt.loadNpmTasks("grunt-contrib-watch");
    grunt.loadNpmTasks("grunt-js-test");

    grunt.registerTask("manifest", function() {
        var manifest = grunt.file.readJSON("manifest_template.json"),
            distFolder = grunt.config("distFolder"),
            dest = distFolder + "/manifest.json";

        manifest.version = grunt.config("pkg.version");
        grunt.file.write(dest, JSON.stringify(manifest, null, 4));
    });

    grunt.registerTask("test", ["jshint", "js-test"]);
    grunt.registerTask("default", ["clean", "jshint", "js-test", "manifest", "compress"]);
};
