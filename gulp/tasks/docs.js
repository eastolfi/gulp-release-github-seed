var gulp = require('gulp');
var fs = require('fs');
var gutil = require('gulp-util');
var rename = require('gulp-rename');
var jsdoc = require('gulp-jsdoc3');
var jsdoc2md = require('jsdoc-to-markdown');
var gulpJsdoc2md = require('gulp-jsdoc-to-markdown');
var conventionalChangelog = require('gulp-conventional-changelog');

gulp.task('doc:api:full', function () {
    return jsdoc2md.render({ files: 'src/**/*.js' })
    .then(function(output) {
        return fs.writeFileSync('api/index.md', output);
    });
});

gulp.task('doc:api:files', function () {
    return gulp.src(['src/app.js'])         // CHANGE: Put your documented files
        .pipe(gulpJsdoc2md(/*{ template: fs.readFileSync('./readme.hbs', 'utf8') }*/))
        .on('error', function (err) {
            gutil.log(gutil.colors.red('jsdoc2md failed'), err.message);
        })
        .pipe(rename(function (path) {
            path.extname = '.md';
        }))
        .pipe(gulp.dest('api'));
});

gulp.task('doc:app', function (cb) {
    var config = require('../../jsdoc.conf.json');
    
    gulp.src(['./src/**/*.js'], {read: false})
        .pipe(jsdoc(config, cb));
});

gulp.task('changelog', function () {
    return gulp.src('CHANGELOG.md', {
        buffer: false
    })
    .pipe(conventionalChangelog({
        preset: 'angular',
        outputUnreleased: true,
        releaseCount: 0
    }, {    // CHANGE: Put your github repository info
        host: 'https://github.com',
        owner: 'GITHUB_USER',
        repository: 'REPOSITORY'
    }))
    .pipe(gulp.dest('./'));
});