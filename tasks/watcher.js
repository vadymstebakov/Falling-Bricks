'use strict';

const gulp = require('gulp');
const $ = require('gulp-load-plugins')();
const del = require('del');
const filepathdel = require('path');

module.exports = function(options) {
	return function() {
		gulp.watch(options.htmlWatch, gulp.series('html'))
			.on('unlink', function(filepath) {
				$.remember.forget('html', filepathdel.resolve(filepath));
				delete $.cached.caches.html[filepathdel.resolve(filepath)];
				let filePathFromSrc = filepathdel.relative(filepathdel.resolve('src'), filepath);
				let destFilePath = filepathdel.resolve('dist', filePathFromSrc);
				del.sync(destFilePath);
			});
	
		gulp.watch(options.styleWatch, gulp.series('style'))
			.on('unlink', function(filepath) {
				$.remember.forget('style', filepathdel.resolve(filepath));
				delete $.cached.caches.style[filepathdel.resolve(filepath)];
			});
		
		gulp.watch(options.jsWatch, gulp.series('js'))
			.on('unlink', function(filepath) {
				$.remember.forget('js', filepathdel.resolve(filepath));
				delete $.cached.caches.js[filepathdel.resolve(filepath)];
			});
	
		gulp.watch(options.imgWatch, gulp.series('img'))
			.on('unlink', function(filepath) {
				delete $.cached.caches.img[filepathdel.resolve(filepath)];
				let filePathFromSrc = filepathdel.relative(filepathdel.resolve('src'), filepath);
				let destFilePath = filepathdel.resolve('dist', filePathFromSrc);
				del.sync(destFilePath);
			});
		
		gulp.watch(options.fontsWatch, gulp.series('fonts'))
			.on('unlink', function(filepath) {
				delete $.cached.caches.fonts[filepathdel.resolve(filepath)];
				let filePathFromSrc = filepathdel.relative(filepathdel.resolve('src'), filepath);
				let destFilePath = filepathdel.resolve('dist', filePathFromSrc);
				del.sync(destFilePath);
			});
	};
};