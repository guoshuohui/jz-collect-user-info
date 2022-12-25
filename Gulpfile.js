// created by guoshuohui

const gulp = require('gulp');
const clean = require('gulp-clean');
const uglify = require('gulp-uglify');
const runSequence = require('run-sequence');
const browserSync = require('browser-sync').create();
const reload = browserSync.reload;

// src
const src = {
	all: 'src/**/*.js',
	index: 'src/index.js',
	test: 'src/test.js'
};

// dist
const dist = 'dist';

// default
gulp.task('default', () => {
	runSequence('clean', 'buildDevelopment', 'server', 'watch');
});

// build
gulp.task('build', () => {
	runSequence('clean', 'buildProduction');
});

// clean
gulp.task('clean', function () {
	return gulp.src(dist, {
		read: false
	}).pipe(clean());
});

// build development
gulp.task('buildDevelopment', (e) => {
	return gulp.src([src.index, src.test])
		.on('error', e => console.error(e))
		.pipe(gulp.dest(dist))
		.pipe(reload({
			stream: true
		}));
});

// build production
gulp.task('buildProduction', (e) => {
	return gulp.src(src.index)
		.pipe(uglify())
		.on('error', e => console.error(e))
		.pipe(gulp.dest(dist))
});

// watch
gulp.task('watch', () => {
	gulp.watch(src.all, () => {
		runSequence('clean', 'buildDevelopment');
	});
	gulp.watch('index.html', reload);
});

// server
gulp.task('server', () => {
	browserSync.init({
		server: {
			baseDir: '.'
		},
		notify: false,
		open: false
	});
});