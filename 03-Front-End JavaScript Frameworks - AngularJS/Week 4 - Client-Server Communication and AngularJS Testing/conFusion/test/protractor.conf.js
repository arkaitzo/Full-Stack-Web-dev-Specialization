exports.config = {
    allScriptsTimeout: 11000,
    specs: [
        'e2e/*.js' // Where our E2E test exists
    ],
    capabilities: {
        'browserName': 'chrome'
    },

    baseUrl: 'http://localhost:3001/',

    framework: 'jasmine',
    directConnect: true, // Only valid for using with Chrome or Firefox

    jasmineNodeOpts: {
        defaultTimeoutInterval: 30000
    }
};