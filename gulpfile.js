var dest = 'dist/',
    electronDest = 'app/',
    wpPluginDest = 'integrations/wordpress/highcharts-editor/',
    packageJson = require('./package.json'),
    name = 'highcharts-editor',
    gulp = require('gulp'),
    rename = require('gulp-rename'),
    uglify = require('gulp-uglify'),
    concat = require('gulp-concat'),
    less = require('gulp-less'),
    electron = require('gulp-electron'),
    jshint = require('gulp-jshint'),
    zip = require('gulp-zip'),
    //The order is important, so we don't do wildcard
    sources =[
        "./src/core/highcharts-editor.js",
        "./src/core/highed.dom.js",
        "./src/core/highed.events.js",
        "./src/core/highed.fileupload.js",

        "./src/core-ui/highed.dimmer.js",
        "./src/core-ui/highed.overlaymodal.js",
        "./src/core-ui/highed.hsplitter.js",
        "./src/core-ui/highed.tabcontrol.js",
        "./src/core-ui/highed.inspector.field.js",
        "./src/core-ui/highed.list.js",
        "./src/core-ui/highed.colorpicker.js",
        "./src/core-ui/highed.toolbar.js",
        "./src/core-ui/highed.fontpicker.js",
        "./src/core-ui/highed.wizstepper.js",
        "./src/core-ui/highed.tooltip.js",
        "./src/core-ui/highed.pushbutton.js",
        "./src/core-ui/highed.tree.js",
        "./src/core-ui/highed.snackbar.js",
            
        "./src/meta/highed.meta.charts.js",
        "./src/meta/highed.meta.options.extended.js",
        "./src/meta/highed.meta.colors.js",
        "./src/meta/highed.meta.fonts.js",
       // "./src/meta/highed.meta.options.advanced.js",
            
        "./src/ui/highed.chart.template.selector.js",
        "./src/ui/highed.chart.customizer.js",
        "./src/ui/highed.wizbar.js",
        "./src/ui/highed.dataimporter.js",
        "./src/ui/highed.exporter.js",
        "./src/ui/highed.chartpreview.js",
            
        "./src/editors/highed.editor.js",
        "./src/editors/highed.modaleditor.js"
    ]
;

gulp.task('less', function () {
    return gulp.src('less/theme.default.less')
               .pipe(less({
                    paths: ['less/'],
                    compress: true 
               }))
               .pipe(rename(name + '.min.css'))
               .pipe(gulp.dest(dest))
               .pipe(gulp.dest(electronDest))
               .pipe(gulp.dest(wpPluginDest))
    ; 
});

gulp.task('plugins', function () {
    return gulp.src('plugins/*.js')
               //.pipe(concat(name + '.js'))
              // .pipe(gulp.dest(dest))               
               //.pipe(rename(name + '.min.js'))
               .pipe(uglify())
               .pipe(gulp.dest(dest + 'plugins'))
    ;
});

gulp.task('wordpress', ['less', 'minify'], function () {
    return gulp.src(wpPluginDest + '*')
               .pipe(zip(name + '.wordpress.zip'))
               .pipe(gulp.dest(dest))
    ;
});


gulp.task('minify', function () {
    return gulp.src(sources)
               .pipe(concat(name + '.js'))
               .pipe(gulp.dest(dest))               
               .pipe(rename(name + '.min.js'))
               .pipe(uglify())
               .pipe(gulp.dest(dest))
               .pipe(gulp.dest(electronDest))
               .pipe(gulp.dest(wpPluginDest))
    ;
});

gulp.task('minify-advanced', function () {
    return gulp.src(sources.concat(['./src/meta/highed.meta.options.advanced.js']))
               .pipe(concat(name + '.js'))
               .pipe(gulp.dest(dest))               
               .pipe(rename(name + '.min.js'))
               .pipe(uglify())
               .pipe(gulp.dest(dest))
               .pipe(gulp.dest(electronDest))
               .pipe(gulp.dest(wpPluginDest))
    ;
});

gulp.task('electron', ['less', 'minify'], function () {
    return gulp.src('')
               .pipe(electron({
                    src: './app',
                    packageJson: {
                        name: packageJson.name,
                        version: packageJson.version
                    },
                    release: './dist/electron',
                    cache: './cache',
                    version: 'v1.3.4',
                    packaging: true,
                    platforms: ['win32-ia32', 'darwin-x64'],
                    platformResources: {
                        darwin: {
                            CFBundleDisplayName: packageJson.name,
                            CFBundleIdentifier: packageJson.name,
                            CFBundleName: packageJson.name,
                            CFBundleVersion: packageJson.version,
                            "icon": 'res/logo.png'
                        },
                        win: {
                            "version-string": packageJson.version,
                            "file-version": packageJson.version,
                            "product-version": packageJson.version,
                            "icon": 'res/logo.ico'
                        }
                    }
               }))
               .pipe(gulp.dest(''))
    ;
});

gulp.task('tinymce', function () {
    return gulp.src(sources.concat('integrations/tinymce.js'))
               .pipe(concat(name + '.tinymce.js'))
               .pipe(gulp.dest(dest))
               .pipe(rename(name + '.tinymce.min.js'))
               .pipe(uglify())
               .pipe(gulp.dest(dest))
    ;
});

gulp.task('default', function () {
    gulp.start('minify', 'tinymce', 'less', 'plugins', 'wordpress');
});

gulp.task('with-advanced', function () {
    gulp.start('minify-advanced', 'tinymce', 'less', 'plugins', 'wordpress');
});