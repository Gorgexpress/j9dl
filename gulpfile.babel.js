var gulp = require('gulp');
var babel = require('gulp-babel');
var nodemon = require('nodemon');

var build = function() {
  gulp.src('server/**/*')
          .pipe(babel())
          .pipe(gulp.dest('dist'));
  
};

gulp.task('build', build);

gulp.task('default', function() {
  nodemon({
    script: 'dist/server.js',
    watch: 'server',
    tasks: ['build']
  })
    .on('restart', function() {
      build();
    })
})


