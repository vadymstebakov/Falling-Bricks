'use strict';

document.addEventListener('DOMContentLoaded', function() {
	let elBg = document.getElementById('bg');
	let elBucket = document.getElementById('bucket');
	let elBricks = document.querySelectorAll('.brick');
	let rec = document.getElementById('record');
	let recNumber = 0;
	let brickSet = [];
	const startPos = -100;
	let screenWidth = document.documentElement.offsetWidth - elBricks[0].offsetWidth;
	let screenHeight = document.documentElement.offsetHeight + elBricks[0].offsetHeight;

	// Move Bucket
	function moveBucket() {
		elBucket.addEventListener('mousedown', function(e) {
			let backetCoords = getCoords(elBucket);
			let shiftX = e.pageX - backetCoords.left;
			let bgCoords = getCoords(elBg);
			
			document.onmousemove = function(e) {
				let newLeft = e.pageX - shiftX - bgCoords.left;
				let rightEdge = elBg.offsetWidth - elBucket.offsetWidth;
		
				if (newLeft < 0) {
					newLeft = 0;
				}
				if (newLeft > rightEdge) {
					newLeft = rightEdge;
				}
				elBucket.style.left = newLeft + 'px';
			};

			document.onmouseup = function() {
				document.onmousemove = document.onmouseup = null;
			};
			return false;
		});

		elBucket.ondragstart = function() {
			return false;
		};

		function getCoords(elem) {
			var box = elem.getBoundingClientRect();

			return {
				top: box.top + pageYOffset,
				left: box.left + pageXOffset
			};
		}
	}
	moveBucket();

	// Animate
	function animate({timing, draw, duration}) {
		let start = performance.now();
		
		requestAnimationFrame(function animate(time) {
			let timeFraction = (time - start) / duration;
			if (timeFraction > 1) timeFraction = 1;
		
			let progress = timing(timeFraction);
		
			draw(progress);
		
			if (timeFraction < 1) {
				requestAnimationFrame(animate);
			}
		});
	}

	function makeLinear(timing) {
		return function(timeFraction) {
			return 1 - timing(1 - timeFraction);
		};
	}
  
	function linear(timeFraction) {
		return timeFraction;
	}
  
	let anLinear = makeLinear(linear);

	//Fall Bricks
	window.onload = function() {
		for (let i = 0; i <elBricks.length; i++) {
			let fall = function() {
				elBricks[i].style.left = mtRand(0, screenWidth) + 'px';
				animate({
					duration: mtRand(2500, 9000),
					timing: anLinear,
					draw: function(progress) {
						elBricks[i].style.top = progress * screenHeight  + 'px';

						if (parseInt(elBricks[i].style.top) >= screenHeight) {
							elBricks[i].style.top = startPos + 'px';
							fall();
						}
					}
				});
			};
			fall();
		}

	};

	// Randomizer
	function mtRand(min, max) {
		return Math.floor(Math.random() * (max - min + 1) + min);
	} 
	
});
