'use strict';

const gulp = require('gulp');
const $ = require('gulp-load-plugins')();

module.exports = function(options) {
	return function() {
		return gulp.src(options.src)
			.pipe($.newer(options.dist))
			.pipe($.cached('fonts'))
			.pipe(gulp.dest(options.dist));
	};
};