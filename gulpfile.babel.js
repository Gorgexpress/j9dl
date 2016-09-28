var gulp = require('gulp');
var babel = require('gulp-babel');
var nodemon = require('nodemon');
var webpack = require('webpack-stream');
var runSequence = require('run-sequence');

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

