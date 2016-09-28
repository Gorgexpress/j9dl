var gulp = require('gulp');
var babel = require('gulp-babel');
var nodemon = require('nodemon');
var webpack = require('webpack-stream');
var runSequence = require('run-sequence');
var gulpLoadPlugins = require('gulp-load-plugins');
var lazypipe = require('lazypipe');

var plugins = gulpLoadPlugins();
var mocha = lazypipe()
  .pipe(plugins.mocha, {
    reporter: 'spec',
    timeout: 5000,
    require: [
      './mocha.conf'
    ]
  });
var build = function() {
  var stream = gulp.src('server/**/*')
    .pipe(babel())
    .pipe(gulp.dest('dist'));
  return stream;

};

gulp.task('build', build);

gulp.task('webpack:bundle', function() {
  return gulp.src('client/app.js')
    .pipe(webpack( require('./webpack.config.js') ))
    .pipe(gulp.dest('client/'));
});

gulp.task('default', ['webpack:bundle', 'server:start']);

gulp.task('server:start',function() {
  nodemon({
    script: 'dist/server.js',
    watch: 'server',
  })
    .on('restart', function() {
      build();
    })
})

gulp.task('start', ['webpack:bundle', 'server:start']);

gulp.task('env:test', function() {
  return process.env.NODE_ENV = 'test';
});

gulp.task('start:test', function() {
  runSequence('env:test', 'start');
});

gulp.task('test',['env:test'], function() {
  return gulp.src(['dist/**/*.integration.js', 'mocha.global.js'])
    .pipe(mocha());
});

