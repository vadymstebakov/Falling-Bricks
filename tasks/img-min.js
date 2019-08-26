'use strict';

const gulp = require('gulp');
const $ = require('gulp-load-plugins')();
const imgCompress = require('imagemin-jpeg-recompress');

module.exports = function(options) {
	return function() {
		return gulp.src(options.src)
			.pipe($.cached('img'))
			.pipe($.newer(options.dist))
			.pipe($.debug({title: 'DEBUG img'}))
			.pipe($.imagemin([
				imgCompress({
					loops: 4,
					min: 70,
					max: 80,
					quality: 'veryhigh'
				}),
				$.imagemin.gifsicle(),
				$.imagemin.optipng(),
				$.imagemin.svgo()
			]))
			.pipe(gulp.dest(options.dist));
	};	
};