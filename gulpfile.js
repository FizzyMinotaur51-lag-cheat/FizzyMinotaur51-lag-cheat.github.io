var gulp    = require('gulp'),
    cp      = require('child_process'),
    browser = require('browser-sync'),
    path = require('path'),
    critical = require('critical');

var $     = require('gulp-load-plugins')({
  pattern: ['*', 'gulp-*', 'gulp.*']
});


var jekyll   = process.platform === 'win32' ? 'jekyll.bat' : 'jekyll';
var messages = {
    jekyllBuild: '<span style="color: grey">Running:</span> $ jekyll build'
};

/**
 * Critical CSS
 */
gulp.task('critical', function (cb) {
 critical.generate({
   base: '_site/',
   src: 'index.html',
   minify: true,
   dest: '_includes/css/critical.css',
   ignore: ['font-face', '@font-face'],
   width: 1400,
   height: 900
 });
});

/**
 * Build the Jekyll Site
 */
gulp.task('jekyll-build', function (done) {
    browser.notify(messages.jekyllBuild);
    return cp.spawn('bundle', ['exec', 'jekyll', 'build', '--force_polling', '-c', '_config.yml,_config_dev.yml'], {stdio: 'inherit'})
        .on('close', done);
});

/**
 * Rebuild Jekyll & do page reload
 */
gulp.task('jekyll-rebuild', ['jekyll-build'], function () {
  browser.reload();
});

/**
 * Wait for jekyll-build, then launch the Server
 */
gulp.task('browser-sync', function() {
    browser({
        server: {
            baseDir: '_site'
        }
    });
});


/**
 * Convert our LESS files to CSS
 */
gulp.task('less', function () {
  return gulp.src(['./_less/app.less'])
      .pipe($.less({
          paths: [ path.join(__dirname, '_less', 'inc'), path.join(__dirname, 'bower_components') ]
      }).on('error', function (err) {
        browser.notify;
        console.log(err);
      }))
      .pipe($.cleancss())
      // .pipe($.autoprefixer({
      //   // browsers: ['last 15 versions', '> 1%', 'ie 8', 'ie 7'],
      //   browsers: ['last 2 versions', 'ie >= 9'],
      //   cascade: true
      // }))
      .pipe($.rename('app.min.css'))
      .pipe(gulp.dest('./assets/css'))
      .pipe(gulp.dest('./_site/assets/css'))
      .pipe(browser.reload({stream:true}));
});

// Concatenate our app scripts

gulp.task('scripts', function() {
    return gulp.src([
      './bower_components/jquery/dist/jquery.min.js',
      './bower_components/jquery.scrollTo/jquery.scrollTo.js',
      './bower_components/smoothscroll-for-websites/SmoothScroll.js',
      './bower_components/svg-injector/svg-injector.js',
      './bower_components/slick-carousel/slick/slick.min.js',
      './_scripts/app.js'
    ])
    .pipe($.uglifyjs())
    .pipe($.rename('app.min.js'))
    .pipe(gulp.dest('./assets/js'))
    .pipe(gulp.dest('./_site/assets/js'))
    .pipe(browser.reload({stream:true}));
});

gulp.task('init-scripts', function() {
    return gulp.src([
      './_scripts/lib/modernizr.min.js',
      './bower_components/picturefill/dist/picturefill.min.js',
      './_scripts/init.js'
    ])
    .pipe($.uglifyjs())
    .pipe($.rename('init.min.js'))
    .pipe(gulp.dest('./assets/js'))
    .pipe(gulp.dest('./_site/assets/js'))
    .pipe(browser.reload({stream:true}));
});

/**
 * Watch less files for changes & recompile
 * Watch html/md files, run jekyll & reload BrowserSync
 */
gulp.task('watch', function () {
    gulp.watch(['./_less/**/*.less'], ['less']);
    gulp.watch(['./_scripts/**/*.js'], ['init-scripts', 'scripts']);
    gulp.watch(['*.html', '*.md', '_includes/**/*.html', '_includes/**/*.md', '_layouts/*.html', '_posts/*', '_data/*'], ['jekyll-rebuild']);
});

/**
 * Add a build command to build our site for production
 */
gulp.task('jekyll-build-prod', function (done) {
    browser.notify(messages.jekyllBuild);
    return cp.spawn('bundle', ['exec', 'jekyll', 'build', '--force_polling', '-c', '_config.yml'], {stdio: 'inherit'})
        .on('close', done);
});

/**
 * Add an assets task so we can explicitly run those tasks after jekyll-build
 */
gulp.task('build', ['jekyll-build-prod'], function(){
  gulp.start('less');
  gulp.start('scripts');
  gulp.start('init-scripts');
  browser.reload();
});

/**
 * Default task, running just `gulp` will compile the less,
 * compile the jekyll site, launch BrowserSync & watch files.
 */
gulp.task('default', ['browser-sync', 'watch']);
