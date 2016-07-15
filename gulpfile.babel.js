var gulp = require('gulp');
var babel = require('gulp-babel');
var nodemon = require('nodemon');

var build = function() {
  var stream = gulp.src('server/**/*')
          .pipe(babel())
          .pipe(gulp.dest('dist'));
  return stream;
  
};

gulp.task('build', build);

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
    tasks: ['build']
  })
    .on('restart', function() {
      build();
    })
})


