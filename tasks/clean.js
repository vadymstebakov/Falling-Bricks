'use strict';

const del = require('del');

module.exports = function(options) {
	return function(callback) {
		del.sync(options.src);
		
		callback();
	};
};