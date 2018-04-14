var path = require('path'),
    gulp = require('gulp'),
    del = require('del'),
    clean = require('gulp-clean'),
    minifycss = require('gulp-minify-css'),
    browserSync = require('browser-sync'),
    watch = require('gulp-watch'),
    plumber = require('gulp-plumber'),
    compass = require('gulp-compass'),
    cleanCSS = require('gulp-clean-css'),
    uglify = require('gulp-uglify'),
    htmlmin = require('gulp-htmlmin'),
    historyFallback = require('connect-history-api-fallback'),
    concat = require('gulp-concat');

// Error
function onError(err) {
    console.log(err);
    this.emit('end');
}

var config = {
    app: './app',
    build: './proj',
};

config
    .src = {
        html: [config.app + '/**/*.html'],
        js: [config.app + '/**/*.js'],
        sass: [config.app + '/assets/scss/**/*.scss'],
        img: [config.app + '/assets/img/**/*'],
        fonts: [config.app + '/assets/fonts/*.{eot,svg,ttf,woff,woff2}'],
        json: [config.app + '/**/*.json']
    };

config
    .dest = {
        html: config.build + '',
        js: config.build + '/assets/js',
        css: config.build + '/assets/css',
        img: config.build + '/assets/img',
        fonts: config.build + '/assets/fonts',
        json: config.build + '/assets/json'
    };

gulp.task('fonts', function () {
    return gulp.src(config.src.fonts)
        .pipe(gulp.dest(config.dest.fonts));
});

gulp.task('img', function () {
    return gulp.src(config.src.img)
        .pipe(gulp.dest(config.dest.img));
});

/*gulp.task('js', function () {
    return gulp.src(config.src.js)
        .pipe(plumber({
            errorHandler: function (error) {
                console.log(error.message);
                this.emit('end');
            }
        }))
        .pipe(uglify({
            mangle: false
        }))
        .pipe(gulp.dest(config.dest.js));
});*/

gulp.task('json', function () {
    return gulp.src([
        config.app + '/components/views/paciente/doencas-relacionadas/doencasRelacionadas.json',
        config.app + '/components/views/medico/manifestacoes-extra-hepaticas/manifestacoesExtraHepaticas.json',
        config.app + '/components/views/paciente/duvidas-frequentes/duvidasFrequentes.json',
        config.app + '/components/views/medico/links-importantes/linksImportantes.json'
    ])
        .pipe(gulp.dest(config.build + '/assets/json'));
});

gulp.task('html', function () {
    return gulp.src(config.src.html)
        .pipe(htmlmin({
            collapseWhitespace: true,
            removeComments: true
        }))
        .pipe(gulp.dest(config.dest.html));
});

// Scripts
gulp.task('js', function () {
    return gulp.src([
        config.app + '/assets/js/_lib/angular.js',
        config.app + '/assets/js/_lib/angular-ui-router.js',
        config.app + '/assets/js/_lib/angular-route.min.js',        
        config.app + '/assets/js/_lib/jquery.min.js',
        config.app + '/assets/js/_lib/slick.min.js',
        config.app + '/assets/js/functions/*.js',

    ])
        .pipe(gulp.dest(config.build + '/assets/js'));
});

gulp.task('js-concat', function () {
    return gulp.src([
        config.app + '/assets/js/module.js',
        config.app + '/assets/js/route.js',
        config.app + '/assets/js/controller/**/*.js'
    ])
        .pipe(concat('scripts.min.js'))
        .pipe(uglify())
        .on('error', onError)
        .pipe(gulp.dest(config.build + '/assets/js'));
});


gulp.task('watch', function () {
    function checkDelete(file) {
        if (file.event === 'unlink' || file.event === 'unlinkDir') {
            var srcPath = path.relative(path.resolve('.'), file.path);
            var destPath = path.resolve(config.build + '', srcPath);
            del.sync(destPath);
        }
    };

    var fontWatch = watch(config.src.fonts, { events: ['add', 'change', 'unlink', 'unlinkDir'] }, function (file) {
        checkDelete(file);
        gulp.start('fonts-watch');
    });

    var imgWatch = watch(config.src.img, { events: ['add', 'change', 'unlink', 'unlinkDir'] }, function (file) {
        checkDelete(file);
        gulp.start('images-watch');
    });

    var jsWatch = watch(config.src.js, { events: ['add', 'change', 'unlink', 'unlinkDir'] }, function (file) {
        checkDelete(file);
        gulp.start('js-watch');
    });

    var jsonWatch = watch(config.src.json, { events: ['add', 'change', 'unlink', 'unlinkDir'] }, function (file) {
        checkDelete(file);
        gulp.start('json-watch');
    });

    var sassWatch = watch(config.src.sass, { events: ['add', 'change', 'unlink', 'unlinkDir'] }, function (file) {
        if (file.event === 'unlink') {
            del.sync(config.dest.css + '/*');
        }
        gulp.start('sass');
    });

    var htmlWatch = watch(config.src.html, { events: ['add', 'change', 'unlink', 'unlinkDir'] }, function (file) {
        checkDelete(file);
        gulp.start('html-watch');
    });
});

gulp.task('sass', function () {
    return gulp.src(config.src.sass)
        .pipe(plumber({
            errorHandler: function (error) {
                console.log(error.message);
                this.emit('end');
            }
        }))
        .pipe(compass({
            css: config.dest.css,
            sass: config.app + '/assets/scss/',
            require: ['compass/import-once/activate']
        }))
        .pipe(cleanCSS())
        .pipe(gulp.dest(config.dest.css))
        .pipe(browserSync.stream());
});

gulp.task('delete', function () {
    del.sync([
        config.build + '/*'
    ]);
});

gulp.task('js-watch', ['js', 'js-concat'], browserSync.reload);
gulp.task('images-watch', ['img'], browserSync.reload);
gulp.task('fonts-watch', ['fonts'], browserSync.reload);
gulp.task('html-watch', ['html'], browserSync.reload);
gulp.task('json-watch', ['json'], browserSync.reload);

gulp.task('files', ['fonts', 'img', 'js', 'js-concat', 'sass', 'html', 'json']);

gulp.task('server', ['delete', 'files', 'watch'], function () {
    browserSync.init({
        server: {
            baseDir: config.build,
            middleware: [
                historyFallback()
            ]
        }
    });
});

gulp.task('default', ['server']);