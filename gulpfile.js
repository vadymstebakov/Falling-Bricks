'use strict';

const gulp = require('gulp');
const path = {
	dist: { 
		html: 'dist/',
		style: 'dist/css/',
		js: 'dist/js/',
		img: 'dist/img/',
		fonts: 'dist/fonts/',
		svg: 'src/img/svg/'
	},
	src: {
		html: 'src/*.html',
		style: 'src/css/**/*.css',
		js: 'src/js/**/*.js',
		img: 'src/img/**/*',
		fonts: 'src/fonts/**/*',
		svg: 'src/img/svg/**/*.svg'
	},
	watch: {
		html: 'src/*.html',
		style: 'src/css/**/*.css',
		js: 'src/js/**/*.js',
		img: 'src/img/**/*',
		fonts: 'src/fonts/**/*'
	}
};

// Lazy Task
function lazyRequireTask(taskName, path, options) {
	options = options || {};
	options.taskName = taskName;
	gulp.task(taskName, function(callback) {
		let task = require(path).call(this, options);
		return task(callback);
	});
}

// HTML
lazyRequireTask('html', './tasks/html.js', {
	src: path.src.html,
	dist: path.dist.html
});

// CSS
lazyRequireTask('style', './tasks/style.js', {
	src: path.src.style,
	dist: path.dist.style
});

// JS
lazyRequireTask('js', './tasks/script.js', {
	src: path.src.js,
	dist: path.dist.js
});

// Img
lazyRequireTask('img', './tasks/img-min.js', {
	src: path.src.img,
	dist: path.dist.img
});

// Fonts
lazyRequireTask('fonts', './tasks/fonts.js', {
	src: path.src.fonts,
	dist: path.dist.fonts
});

// SVG
lazyRequireTask('svg-sprite', './tasks/svg-sprite.js', {
	src: path.src.svg,
	dist: path.dist.svg
});

// Clear dir
lazyRequireTask('clean', './tasks/clean.js', {
	src: 'dist/'
});

// Browser-Sync
lazyRequireTask('browser-sync', './tasks/browser-sync.js', {
	src: 'dist/**/*.*'
});

// Builder
gulp.task('build', gulp.parallel(
	'html',
	'style',
	'js',
	'img',
	'fonts'
));

// Watcher
lazyRequireTask('watch', './tasks/watcher.js', {
	htmlWatch: path.watch.html,
	styleWatch: path.watch.style,
	jsWatch: path.watch.js,
	imgWatch: path.watch.img,
	fontsWatch: path.watch.fonts
});

// Start
gulp.task('default', gulp.series('build', gulp.parallel(
	'watch',
	'browser-sync'
)));