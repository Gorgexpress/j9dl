var gulp = require('gulp');
var babel = require('gulp-babel');
var nodemon = require('nodemon');
gulp.task('default', function() {
  nodemon({
    script: 'dist/server.js'
    , watch: 'src'
    , tasks: ['build']
  });
});

gulp.task('build', function() {
  return gulp.src('server/**/*')
          .pipe(babel())
          .pipe(gulp.dest('dist'));
});
