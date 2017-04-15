module.exports = function (config) {
    
    config.set({
        
        basePath: './',
        
        files: [
            { pattern: 'index.ts' },
            { pattern: 'hook.spec.ts' }
        ],

        exclude: [
            '*.d.ts'
        ],

        preprocessors: {
            '*.ts': ['karma-typescript']
        },

        frameworks: ['jasmine', 'karma-typescript'],
        browsers: ['Firefox'],
        plugins: [
            'karma-jasmine',
            'karma-spec-reporter',
            'karma-firefox-launcher',
            'karma-typescript'
        ],

        karmaTypescriptConfig: {
            reports: {
                'text-summary': '',
                html: 'coverage',
                lcovonly: 'coverage'
            },
            compilerOptions: {
              lib: ['es6', 'dom']
            }
        },
        
        reporters: ['spec', 'karma-typescript'],
        singleRun: true,
        autoWatch: false,
        colors: true,
        logLevel: config.LOG_INFO
    });
    
}
