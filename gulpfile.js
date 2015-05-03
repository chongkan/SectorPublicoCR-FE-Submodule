var gulp = require('gulp'),
    sass = require('gulp-ruby-sass'),
    filter = require('gulp-filter');
var notify = require("gulp-notify");
var bower = require('gulp-bower');
var browserSync = require('browser-sync');
var reload = browserSync.reload;

var config = {
    sassPath: './resources/sass',
    bowerDir: './bower_components'
}

gulp.task('bower', function () {
    return bower().pipe(gulp.dest(config.bowerDir));
});
// ----------------------------------------------
gulp.task('icons', function () {
    return gulp.src(config.bowerDir + '/fontawesome/fonts/**.*')
        .pipe(gulp.dest('./public/fonts'))
        .pipe(gulp.dest('./src/fonts'));
});
// ----------------------------------------------
gulp.task('html', function () {
    return gulp.src('./src/*.html').on('error', function (err) {
        console.error('Error!', err.message);
    }).pipe(gulp.dest('./public'));
});
// ----------------------------------------------
gulp.task('sass', function () {
    return sass(config.sassPath + '/style.scss', {
        style: 'compressed',
        loadPath: [
            config.sassPath,
            config.bowerDir + '/bootstrap-sass-official/assets/stylesheets',
            config.bowerDir + '/fontawesome/scss'
        ]
    }).on('error', function (err) {
        console.error('Error!', err.message);
    }).pipe(filter('**/*.css'))
        .pipe(gulp.dest('./public/css'))
        .pipe(gulp.dest('./src/css'))
        .pipe(reload({stream: true}));
});
// ----------------------------------------------
gulp.task('serve', ['sass', 'icons', 'html', 'watch'], function () {
    browserSync({
        notify: false,
        port: 9000,
        server: {
            baseDir: ['.tmp','./src'],
            routes: {
                '/bower_components': 'bower_components'
            }
        }
    });
});
// ----------------------------------------------
// Rerun the task when a file changes
// ----------------------------------------------
gulp.task('watch', function () {
    gulp.watch(config.sassPath + '/**/*.scss', ['sass']).on('error', function (err) {
        console.error('Error!', err.message);
    });
    gulp.watch('./src/*.html').on('error', function (err) {
        console.error('Error!', err.message);
    }).on('change', reload);
});
// ----------------------------------------------
gulp.task('default', ['bower', 'icons', 'sass', 'serve']);
