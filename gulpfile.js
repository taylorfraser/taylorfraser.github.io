var gulp           = require('gulp'),
    sass           = require('gulp-sass'),
    shell          = require('gulp-shell'),
    sourcemaps     = require('gulp-sourcemaps'),
    browsersync    = require('browser-sync'),
    browserify     = require('browserify'),
    autoprefixer   = require('gulp-autoprefixer')


// GULP TASK(S)


gulp.task('sass', function() {
  return gulp.src('_assets/sass/**/*.scss')
    .pipe(sourcemaps.init())
    .pipe(sass()).on('error', sass.logError)
    .pipe(autoprefixer(supported))
    .pipe(gulp.dest('css'))
    .pipe(gulp.dest('_site/css'))
    .pipe(browsersync.stream())
});

const supported = [
  '> 1%',
  'last 2 versions',
  'IE >= 9'
];

var scripts = function () {
  var b = browserify({
    entries: './_assets/scripts/global.js'
  });

  return b.transform('babelify', {
    presets: ['es2015']
  }).on('error', function (err) { console.log(err); })
  .bundle()
    .pipe(source('all.js'))
    .pipe(buffer())
    .pipe(gulp.dest('scripts'))
    .pipe(browsersync.stream());
};

gulp.task('build:scripts', scripts);

gulp.task('watch', function() {
  gulp.start('sass');
  browsersync.init({
    server: {
      baseDir: '_site'
    },
    open: false,
  });

  gulp.watch([
    '_assets/sass/**/*.scss'
  ], ['sass']);

  gulp.watch([
    '_assets/js/**/*.js'
  ], ['build:scripts']);
});

gulp.task('jekyll:watch', shell.task(['bundle exec jekyll build --watch --incremental --limit_posts 30 --config _config.yml,_assets/_config.development.yml']));
gulp.task('default', ['jekyll:watch', 'watch']);
