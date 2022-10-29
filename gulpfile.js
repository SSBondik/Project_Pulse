const gulp        = require('gulp');
const browserSync = require('browser-sync');
const sass        = require('gulp-sass')(require('sass'));
const cleanCSS = require('gulp-clean-css');
const autoprefixer = require('gulp-autoprefixer');
const rename = require("gulp-rename");
const imagemin = require('gulp-imagemin');
const htmlmin = require('gulp-htmlmin');

gulp.task('server', function() {

    browserSync({
        server: {
            baseDir: "dist" //Было "src"
        }
    });

    gulp.watch("src/*.html").on('change', browserSync.reload);
});

gulp.task('styles', function() {
    return gulp.src("src/sass/**/*.+(scss|sass)")
        .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
        .pipe(rename({suffix: '.min', prefix: ''}))
        .pipe(autoprefixer())
        .pipe(cleanCSS({compatibility: 'ie8'}))
        .pipe(gulp.dest("dist/css")) //Будем складывать не в src а в dist/css
        .pipe(browserSync.stream());
});

gulp.task('watch', function() {
    gulp.watch("src/sass/**/*.+(scss|sass|css)", gulp.parallel('styles')); //стаховка чтобы файлы css тоже компилировались
    gulp.watch("src/*.html").on('change', gulp.parallel('html')); //когда файл html будет изменятся будет запускаться команда ниже
});

//Для html
gulp.task('html', function() { //Для сжатия html файлов
    return gulp.src("src/*.html") //Будет брать все файлы html с паки src
        .pipe(htmlmin({ collapseWhitespace: true })) //Сжимать их
        .pipe(gulp.dest("dist/")); //куда будет помещаться файл над которым мы работали
});

//Для скриптов
gulp.task('scripts', function() { //Для прермещения скриптов с папки src в папку dist
    return gulp.src("src/js/**/*.js") //Будет брать любые файлы с папки js
        .pipe(gulp.dest("dist/js")); //куда будет помещаться файл над которым мы работали
});

//Для шрифтов
gulp.task('fonts', function() { //Для прермещения шрифтов с папки src в папку dist
    return gulp.src("src/fonts/**/*") //Будет брать любые файлы с папки fonts
        .pipe(gulp.dest("dist/fonts")); //куда будет помещаться файл над которым мы работали
});

//Для иконок
gulp.task('icons', function() { //Для прермещения иконок с папки src в папку dist
    return gulp.src("src/icons/**/*") //Будет брать любые файлы с папки icons
        .pipe(gulp.dest("dist/icons")); //куда будет помещаться файл над которым мы работали
});

//Для перемещения папки mailer
gulp.task('mailer', function() { //Для прермещения папки mailer в папку dist
    return gulp.src("src/mailer/**/*") //Будет брать любые файлы с папки mailer
        .pipe(gulp.dest("dist/mailer")); //куда будет помещаться файл над которым мы работали
});

//Для сжатия картинок
gulp.task('images', function() { //Для прермещения картинок в папку dist
    return gulp.src("src/img/**/*") //Будет брать все картинки
        .pipe(imagemin()) //Для авто сжатия картинок
        .pipe(gulp.dest("dist/img")); //куда будет помещаться файл над которым мы работали
});

gulp.task('default', gulp.parallel('watch', 'server', 'styles', 'scripts', 'html', 'fonts', 'icons', 'mailer', 'images'));