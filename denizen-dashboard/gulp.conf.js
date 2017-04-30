'use strict';

class GulpConfig {
  constructor() {
    let config = {
      source: './src/',
      build: './build/',
      resources: './src/resources/**/*',
      fonts: './src/fonts/**/*',
      wiredepConf: {
        json: require('./bower.json'),
        directory: './bower_components/'
      },
      injectConf: {
        relative: true
      },
      jsOrder: [
        'lib/**/*',
        '**/app.module.js',
        '**/*.module.js',
        '**/*.js'
      ],
      lib: [
        './build/lib/**/*.module.js',
        './build/lib/**/*.js',
        './build/app/**/*.module.js',
        './build/app/**/*.js',
        './build/**/*.css',
      ]
    };

    //config.buildJs = config.build + 'app/**/*.js';
    config.sourceApp = config.source + 'app/**/*';

    config.filesToWatch = [
      config.source + '**/*.{js,html,css,scss,json}'
    ];


    return config;

  }
}

module.exports = new GulpConfig();
