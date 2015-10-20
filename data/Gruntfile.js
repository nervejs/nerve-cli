module.exports = function (grunt) {
    'use strict';

    grunt.loadNpmTasks('grunt-nerve-handlebars');

    grunt.initConfig({
        'nerve-handlebars': {
            'main-amd': {
                options: {
                    helpersPath: 'handlebars-helpers'
                },
                cwd: 'tmpl',
                dst: 'dist/tmpl/amd/',
                src: [
                    '**/*.hbs'
                ],
                filter: 'isFile'
            },
            'modules-amd': {
                options: {
                    helpersPath: 'handlebars-helpers'
                },
                cwd: 'src/pages/',
                dst: 'dist/pages/amd/',
                src: [
                    '**/tmpl/**/*.hbs'
                ],
                filter: 'isFile'
            },
            'main-commonjs': {
                options: {
                    isCommonJs: true
                },
                cwd: 'tmpl',
                dst: 'dist/tmpl/commonjs/',
                src: [
                    '**/*.hbs'
                ],
                filter: 'isFile'
            },
            'modules-commonjs': {
                options: {
                    isCommonJs: true
                },
                cwd: 'src/pages/',
                dst: 'dist/pages/commonjs/',
                src: [
                    '**/tmpl/**/*.hbs'
                ],
                filter: 'isFile'
            }
        }
    });

    grunt.registerTask('default', [
        'nerve-handlebars'
    ]);
};