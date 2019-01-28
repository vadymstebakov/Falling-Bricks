'use strict';

const gulp = require('gulp');
const $ = require('gulp-load-plugins')();

module.exports = function(options) {
	return function() {
		return gulp.src(options.src)
			.pipe($.plumber({
				errorHandler: $.notify.onError(function(err) {
					return {
						title: 'html',
						message: err.message
					};
				})
			}))
			.pipe($.cached('html'))
			.pipe($.debug({title: 'DEBUG html'}))
			.pipe($.remember('html'))
			.pipe(gulp.dest(options.dist));
	};
};