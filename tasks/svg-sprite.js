'use strict';

const gulp = require('gulp');
const $ = require('gulp-load-plugins')();

module.exports = function(options) {
	return function() {
		return gulp.src(options.src)
			.pipe($.svgmin({
				js2svg: {
					pretty: true
				}
			}))
			.pipe($.cheerio({
				run: function($) {
					$('[fill]').removeAttr('fill');
					$('[stroke]').removeAttr('stroke');
					$('[style]').removeAttr('style');
				},
				parserOptions: {
					xmlMode: true
				}
			}))
			.pipe($.replace('&gt;', '>'))
			.pipe($.svgSprites({
				mode: 'symbols',
				preview: false,
				selector: 'icon-%f',
				svg: {
					symbols: 'symbol_sprite.html'
				}
			}))
			.pipe(gulp.dest(options.dist));
	};	
};