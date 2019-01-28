'use strict';

const gulp = require('gulp');
const $ = require('gulp-load-plugins')();
const pngquant = require('imagemin-pngquant');

module.exports = function(options) {
	return function() {
		return gulp.src(options.src)
			.pipe($.cached('img'))
			.pipe($.newer(options.dist))
			.pipe($.debug({title: 'DEBUG img'}))
			.pipe($.imagemin({
				interlaced: true,
				progressive: true,
				svgoPlugins: [{removeVeiwBox: false}],
				une: [pngquant()]
			}))
			.pipe(gulp.dest(options.dist));
	};	
};