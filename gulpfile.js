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
    nodemon = require('gulp-nodemon');


// Error
function onError(err) {
    console.log(err);
    this.emit('end');
}

var config = {
    app: './app',
    proj: './proj',
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
        html: config.proj + '',
        js: config.proj + '/assets/js',
        css: config.proj + '/assets/css',
        img: config.proj + '/assets/img',
        fonts: config.proj + '/assets/fonts',
        json: config.proj + '/assets/json'
    };

var BROWSER_SYNC_RELOAD_DELAY = 500;

gulp.task('nodemon', function (cb) {
    var called = false;
    return nodemon({
    
        // nodemon our expressjs server
        script: 'server.js',
    
        // watch core server file(s) that require server restart on change
        watch: ['server.js']
    })
        .on('start', function onStart() {
        // ensure start only got called once
        if (!called) { cb(); }
        called = true;
        })
        .on('restart', function onRestart() {
        // reload connected browsers after a slight delay
        setTimeout(function reload() {
            browserSync.reload({
            stream: false
            });
        }, BROWSER_SYNC_RELOAD_DELAY);
    });
});

gulp.task('fonts', function () {
    return gulp.src(config.src.fonts)
        .pipe(gulp.dest(config.dest.fonts));
});

gulp.task('img', function () {
    return gulp.src(config.src.img)
        .pipe(gulp.dest(config.dest.img));
});


gulp.task('json', function () {
    return gulp.src([
        config.app + '/assets/json/*.json'
    ])
        .pipe(gulp.dest(config.proj + '/assets/json'));
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
        .pipe(gulp.dest(config.proj + '/assets/js'));
});

gulp.task('js-concat', function () {
    return gulp.src([
        config.app + '/assets/js/module.js',
        config.app + '/assets/js/route.js',
        config.app + '/assets/js/controller/*.js'
    ])
        .pipe(uglify())
        .on('error', onError)
        .pipe(gulp.dest(config.proj + '/assets/js'));
});


gulp.task('watch', function () {
    function checkDelete(file) {
        if (file.event === 'unlink' || file.event === 'unlinkDir') {
            var srcPath = path.relative(path.resolve('.'), file.path);
            var destPath = path.resolve(config.proj + '', srcPath);
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
        config.proj + '/*'
    ]);
});

gulp.task('js-watch', ['js', 'js-concat'], browserSync.reload);
gulp.task('images-watch', ['img'], browserSync.reload);
gulp.task('fonts-watch', ['fonts'], browserSync.reload);
gulp.task('html-watch', ['html'], browserSync.reload);
gulp.task('json-watch', ['json'], browserSync.reload);

gulp.task('files', ['fonts', 'img', 'js', 'js-concat', 'sass', 'html', 'json']);

gulp.task('browser-sync', ['nodemon', 'delete', 'files', 'watch'], function () {
    browserSync.init({
            // informs browser-sync to proxy our expressjs app which would run at the following location
        proxy: 'http://localhost:3000',

        // informs browser-sync to use the following port for the proxied app
        // notice that the default port is 3000, which would clash with our expressjs
        port: 4000,

        // open the proxied app in chrome
        // browser: ['google-chrome']
        
        // server: {
        //     baseDir: config.proj,
        //     middleware: [
        //         historyFallback()
        //     ]
        // }
    });
});

gulp.task('default', ['browser-sync'], function(){
     // gulp.watch('proj/**/*.js',   ['js', browserSync.reload]);
    // gulp.watch('proj/**/*.css',  ['css']);
    // gulp.watch('public/**/*.html', ['bs-reload']);
});
