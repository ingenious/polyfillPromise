var gulp = require("gulp"),
    mocha = require('gulp-mocha'),
    closureCompiler = require('gulp-closure-compiler'),
    replace = require('gulp-replace'),
      runSequence   = require('run-sequence');


gulp.task('native-tests', function() {
    return gulp.src('tests/native/*.js', {
        read: false
    })
    .pipe(mocha());
});

gulp.task('polyfill-tests', function() {
    return gulp.src('tests/polyfill/*.js', {
        read: false
    })
    .pipe(mocha());
});

gulp.task('minify', function() {
    return gulp.src('./polyfillPromise-0.1.js')
        .pipe(closureCompiler({
            compilerPath: 'closure_compiler/compiler.jar',
            fileName: 'polyfillPromise-0.1.min.js'
        }))
        .pipe(gulp.dest('./'))     
        .pipe(replace('b=function(a)', 'b=function Promise(a)'))
        .pipe(gulp.dest('./'));
});

gulp.task('minified-tests', function() {
    return gulp.src('tests/minified/*.js', {
        read: false
    })
    .pipe(mocha());
});

gulp.task('tests',function(callback){
	runSequence('native-tests', 'polyfill-tests', 'minified-tests', callback);
});

gulp.task('default', function(callback) {
    runSequence('minify', 'tests', callback);
});