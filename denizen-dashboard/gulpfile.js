'use strict';

const gulp = require('gulp');
const del = require('del');
const wiredep = require('wiredep').stream;
const inject = require('gulp-inject');
const debug = require('gulp-debug');
const useref = require('gulp-useref');
const mainBowerFiles = require('gulp-main-bower-files');
const uglify = require('gulp-uglify');
const sass = require('gulp-sass');
const browserSync = require('browser-sync').create();

const config = require('./gulp.conf');

gulp.task('inject', ['copy-files', 'build-sass'], function() {
  return gulp.src(config.build + '**/*.html')
    //.pipe(wiredep(config.wiredepConf))
    .pipe(inject(gulp.src(config.lib, {read: false}), config.injectConf))
    .pipe(gulp.dest(config.build));
});

gulp.task('clean-build', function(cb) {
  return del([config.build], cb);
});

gulp.task('copy-files', ['clean-build', 'copy-own-files', 'copy-bower-files', 'copy-images', 'copy-fonts']);

gulp.task('copy-own-files', ['clean-build'], function () {
  let ownFiles = config.source + '**/*.{js,css,json,html}';
  return gulp.src(ownFiles)
    .pipe(gulp.dest(config.build));
});

gulp.task('copy-bower-files', ['clean-build'], function(){
  return gulp.src('./bower.json')
    .pipe(mainBowerFiles())
    .pipe(gulp.dest(config.build + '/lib'));
});

gulp.task('copy-images', ['clean-build'], function () {
  return gulp.src(config.resources)
    .pipe(gulp.dest(config.build + '/resources'));
});

gulp.task('copy-fonts', ['clean-build'], function () {
  return gulp.src(config.fonts)
    .pipe(gulp.dest(config.build + '/fonts'));
});

gulp.task('build-sass', ['clean-build'], function () {
  var sources = gulp.src([config.source + '**/*.scss', '!' + config.source + 'index.styles.scss' ]);
  var target = gulp.src(config.source + 'index.styles.scss');

  return target.pipe(inject(
    sources, {
      starttag: '// inject:{{ext}}',
      endtag: '// endinject',
      transform: function (filepath) {
        return '@import "' + filepath + '";';
      },
      relative:true
    }))
    .pipe(debug())
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest(config.build));
});

gulp.task('serve-browser', function() {
  browserSync.init({
    server: {
      baseDir: config.build,
      online: true
    },
    browser: 'google chrome'
  });
});

gulp.task('reload', ['build'], function (done) {
  browserSync.reload();
  done();
});

gulp.task('build', ['copy-files', 'inject', 'build-sass']);

gulp.task('serve', ['build', 'serve-browser'], function () {
  gulp.watch(config.filesToWatch, ['reload']);
});

gulp.task('default', ['serve']);


