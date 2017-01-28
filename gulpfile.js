var gulp = require('gulp'),
    gutil = require('gulp-util'),
    coffee = require('gulp-coffee');

var CoffeeSources = [
  'components/coffee/*.coffee'
];

gulp.task('coffee', function(){
  gulp.src(CoffeeSources)
      .pipe(coffee({bare: true})
        .on('error', gutil.log)) //you have to log errors or coffeescript will crash gulp in the terminal
      .pipe(gulp.dest('components/script'));
});

gulp.task('watch', function(){
  gulp.watch(CoffeeSources, ['coffee']);
});

gulp.task('default', ['coffee', 'watch']);
