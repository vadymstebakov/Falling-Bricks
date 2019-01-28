'use strict';

const gulp = require('gulp');
const $ = require('gulp-load-plugins')();

module.exports = function(options) {
	return function() {
		return gulp.src(options.src)
			.pipe($.plumber({
				errorHandler: $.notify.onError(function(err) {
					return {
						title: 'js',
						message: err.message
					};
				})
			}))
			.pipe($.cached('js'))
			.pipe($.babel({
				presets: ['@babel/env'],
				retainLines: true
			}))
			.pipe($.debug({title: 'DEBUG js'}))
			.pipe($.remember('js'))
			// .pipe($.concat('script.min.js'))
			// .pipe($.uglifyjs())
			.pipe(gulp.dest(options.dist));
	};	
};