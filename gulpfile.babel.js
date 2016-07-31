var gulp = require('gulp');
var babel = require('gulp-babel');
var nodemon = require('nodemon');
var webpack = require('webpack-stream');

var build = function() {
  var stream = gulp.src('server/**/*')
          .pipe(babel())
          .pipe(gulp.dest('dist'));
  return stream;
  
};

gulp.task('build', build);

gulp.task('bundle', function() {
  return gulp.src('src/entry.js')
    .pipe(webpack( require('./webpack.config.js') ))
    .pipe(gulp.dest('client/'));
});

gulp.task('default', ['build'], function() {
  nodemon({
    script: 'dist/server.js',
    watch: 'server',
    tasks: ['build']
  })
    .on('restart', function() {
      build();
    })
})

gulp.task('start', function() {
  nodemon({
    script: 'dist/server.js',
    watch: 'server',
  })
    .on('restart', function() {
      build();
    })
})


